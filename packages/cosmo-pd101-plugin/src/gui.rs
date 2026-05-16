//! GUI — WebView-based editor for the Cosmo PD-101 plugin.
//!
//! Implements truce's [`Editor`] trait, embedding a wry [`WebView`] as a
//! child of the host's parent window (NSView on macOS).

#![cfg_attr(target_os = "macos", allow(deprecated, unexpected_cfgs))]

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
#[cfg(target_os = "macos")]
use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use arc_swap::ArcSwap;
use truce_core::editor::{Editor, RawWindowHandle};
use truce_core::PluginContext;
#[cfg(target_os = "macos")]
use wry::WebViewBuilder;
#[cfg(target_os = "macos")]
use wry::WebViewBuilderExtDarwin;

use crate::handle_ipc_invoke;
use crate::CzPluginParams;
use crate::{
    append_log, PerformanceCountersHandle, ScopeBuffer, SharedRuntimeModSources, UiInputQueue,
};
use cosmo_synth_engine::params::SynthParams;

// ─── Size constants ──────────────────────────────────────────────────────────

pub const DEFAULT_WIDTH: u32 = 1152;
pub const DEFAULT_HEIGHT: u32 = 864;

// ─── Per-format URL scheme ───────────────────────────────────────────────────

static WEBVIEW_SCHEME_COUNTER: AtomicU64 = AtomicU64::new(0);

fn get_instance_scheme() -> String {
    let id = WEBVIEW_SCHEME_COUNTER.fetch_add(1, Ordering::SeqCst);
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    format!("cz-{}-{}-{}", std::process::id(), id, now)
}

#[cfg(target_os = "macos")]
fn webview_data_store_identifier(seed: &str) -> [u8; 16] {
    let mut first = DefaultHasher::new();
    seed.hash(&mut first);
    let a = first.finish().to_le_bytes();

    let mut second = DefaultHasher::new();
    "cosmo-pd101".hash(&mut second);
    seed.hash(&mut second);
    let b = second.finish().to_le_bytes();

    let mut id = [0_u8; 16];
    id[..8].copy_from_slice(&a);
    id[8..].copy_from_slice(&b);
    id
}

// ─── WebViewContainer ────────────────────────────────────────────────────────

struct WebViewContainer {
    webview: Option<wry::WebView>,
}

unsafe impl Send for WebViewContainer {}
unsafe impl Sync for WebViewContainer {}

// ─── CzEditor ────────────────────────────────────────────────────────────────

pub struct CzEditor {
    synth_params: Arc<ArcSwap<SynthParams>>,
    rt_synth_params: Arc<ArcSwap<SynthParams>>,
    runtime_mod_sources: SharedRuntimeModSources,
    synth_params_version: Arc<AtomicU64>,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    performance_counters: PerformanceCountersHandle,
    host_scale_factor: Arc<Mutex<f32>>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    pending_parent_ns_view: Option<usize>,
    params: Arc<CzPluginParams>,
    #[cfg(target_os = "macos")]
    standalone_window: Option<StandaloneWindow>,
}

impl Drop for CzEditor {
    fn drop(&mut self) {
        append_log("CzEditor::drop");
        self.destroy_webview();
    }
}

impl CzEditor {
    fn destroy_webview(&mut self) {
        append_log("CzEditor::destroy_webview");
        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = None;
        }
        self.pending_parent_ns_view = None;
        self.clear_standalone_window();
    }

    #[cfg(target_os = "macos")]
    fn clear_standalone_window(&mut self) {
        self.standalone_window = None;
    }

    #[cfg(not(target_os = "macos"))]
    fn clear_standalone_window(&mut self) {}

    pub(crate) fn new(
        synth_params: Arc<ArcSwap<SynthParams>>,
        rt_synth_params: Arc<ArcSwap<SynthParams>>,
        synth_params_version: Arc<AtomicU64>,
        scope_buffer: ScopeBuffer,
        ui_input_queue: UiInputQueue,
        performance_counters: PerformanceCountersHandle,
        params: Arc<CzPluginParams>,
        runtime_mod_sources: SharedRuntimeModSources,
    ) -> Self {
        Self {
            synth_params,
            rt_synth_params,
            runtime_mod_sources,
            synth_params_version,
            scope_buffer,
            ui_input_queue,
            performance_counters,
            host_scale_factor: Arc::new(Mutex::new(1.0)),
            webview_state: Arc::new(Mutex::new(WebViewContainer { webview: None })),
            pending_parent_ns_view: None,
            params,
            #[cfg(target_os = "macos")]
            standalone_window: None,
        }
    }

    #[cfg(target_os = "macos")]
    fn has_live_webview(&self) -> bool {
        self.webview_state
            .lock()
            .map(|container| container.webview.is_some())
            .unwrap_or(false)
    }

    #[cfg(target_os = "macos")]
    fn try_create_webview(&mut self, ns_view: *mut std::ffi::c_void) -> bool {
        let Some(resource_dir) = plugin_resource_dir() else {
            append_log(
                "CzEditor::try_create_webview: resource dir unavailable; skipping WebView creation",
            );
            return false;
        };
        append_log(&format!("resource_dir: {}", resource_dir.display()));

        let synth_params = self.synth_params.clone();
        let rt_synth_params = self.rt_synth_params.clone();
        let runtime_mod_sources = self.runtime_mod_sources.clone();
        let synth_params_version = self.synth_params_version.clone();
        let scope_buffer = self.scope_buffer.clone();
        let ui_input_queue = self.ui_input_queue.clone();
        let performance_counters = self.performance_counters.clone();
        let params = self.params.clone();
        let webview_state_for_ipc = self.webview_state.clone();

        let (webview, standalone_window) = unsafe {
            build_webview_from_ns_view(
                ns_view,
                resource_dir,
                synth_params,
                rt_synth_params,
                synth_params_version,
                scope_buffer,
                ui_input_queue,
                performance_counters,
                params,
                runtime_mod_sources,
                webview_state_for_ipc,
            )
        };

        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = webview;
        }

        self.standalone_window = standalone_window;

        if self.has_live_webview() {
            self.pending_parent_ns_view = None;
            self.push_params();
            self.apply_scale_normalization();
            true
        } else {
            false
        }
    }

    fn push_params(&self) {
        #[cfg(target_os = "macos")]
        if !is_main_thread() {
            return;
        }

        let sp = self.synth_params.load();
        let Ok(json_str) = serde_json::to_string(sp.as_ref()) else {
            return;
        };
        let escaped = json_str.replace('\\', "\\\\").replace('"', "\\\"");
        let script = format!(
            "if(typeof window.__czOnParams === 'function') {{ window.__czOnParams(\"{escaped}\"); }}"
        );
        if let Ok(container) = self.webview_state.lock() {
            if let Some(wv) = &container.webview {
                let _ = wv.evaluate_script(&script);
            }
        }
    }

    fn apply_scale_normalization(&self) {
        #[cfg(target_os = "macos")]
        if !is_main_thread() {
            return;
        }

        let factor = self
            .host_scale_factor
            .lock()
            .map(|v| *v)
            .unwrap_or(1.0)
            .max(0.01);
        let zoom = 1.0 / factor;
        let script = format!(
            "if (document?.documentElement) {{ document.documentElement.style.zoom = '{zoom}'; }}"
        );

        if let Ok(container) = self.webview_state.lock() {
            if let Some(wv) = &container.webview {
                let _ = wv.evaluate_script(&script);
            }
        }
    }
}

impl Editor for CzEditor {
    fn size(&self) -> (u32, u32) {
        (DEFAULT_WIDTH, DEFAULT_HEIGHT)
    }

    fn screenshot(
        &mut self,
        _params: Arc<dyn truce_params::Params>,
    ) -> Option<(Vec<u8>, u32, u32)> {
        screenshot_webview()
    }

    fn open(&mut self, parent: RawWindowHandle, _context: PluginContext) {
        append_log("CzEditor::open");

        #[cfg(not(target_os = "macos"))]
        {
            append_log("CzEditor::open: non-macOS build; no-op");
            return;
        }

        #[cfg(target_os = "macos")]
        {
            if !is_main_thread() {
                append_log("CzEditor::open called off main thread; skipping WebView creation");
                return;
            }

            let ns_view = match parent {
                RawWindowHandle::AppKit(ptr) => ptr,
                _ => {
                    append_log("CzEditor::open: unsupported window handle");
                    return;
                }
            };
            self.pending_parent_ns_view = Some(ns_view as usize);
            let _ = self.try_create_webview(ns_view);
        }
    }

    fn close(&mut self) {
        append_log("CzEditor::close");
        self.destroy_webview();
    }

    fn idle(&mut self) {
        #[cfg(target_os = "macos")]
        if !is_main_thread() {
            return;
        }

        #[cfg(target_os = "macos")]
        if !self.has_live_webview() {
            if let Some(ns_view) = self.pending_parent_ns_view {
                let ns_view = ns_view as *mut std::ffi::c_void;
                if unsafe { parent_has_window(ns_view) } {
                    append_log("idle: retrying deferred WebView creation");
                    let _ = self.try_create_webview(ns_view);
                }
            }
        }

        self.push_params();
    }

    fn set_scale_factor(&mut self, factor: f64) {
        if let Ok(mut f) = self.host_scale_factor.lock() {
            *f = factor as f32;
        }
    }
}

// ─── Screenshot (macOS) ──────────────────────────────────────────────────────

#[cfg(target_os = "macos")]
fn screenshot_webview() -> Option<(Vec<u8>, u32, u32)> {
    use dispatch2::run_on_main;
    run_on_main(|_mtm| screenshot_webview_impl())
}

/// Create a hidden WKWebView, load the plugin UI, capture a snapshot,
/// and return RGBA pixel data. Must be called on the main thread.
#[cfg(target_os = "macos")]
fn screenshot_webview_impl() -> Option<(Vec<u8>, u32, u32)> {
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;

    use block2::RcBlock;
    use objc2::rc::{Allocated, Retained};
    use objc2::{class, msg_send, msg_send_id, AnyThread};
    use objc2_app_kit::{
        NSBackingStoreType, NSBitmapImageRep, NSImage, NSWindow, NSWindowStyleMask,
    };
    use objc2_foundation::{NSDate, NSPoint, NSRect, NSRunLoop, NSSize, NSString, NSURL};
    use objc2_web_kit::{WKWebView, WKWebViewConfiguration};

    let resource_dir = plugin_resource_dir()?;
    let html_path = resource_dir.join("index.html");
    if !html_path.is_file() {
        append_log("screenshot: index.html not found");
        return None;
    }
    append_log(&format!("screenshot: loading {}", html_path.display()));

    let frame = NSRect::new(NSPoint::new(0.0, 0.0), NSSize::new(1152.0, 864.0));

    // ── WKWebViewConfiguration ─────────────────────────────────────────────
    let config: Retained<WKWebViewConfiguration> =
        unsafe { msg_send_id![class!(WKWebViewConfiguration), new] };

    // ── Hidden NSWindow to host the WKWebView ──────────────────────────────
    let _window: Retained<NSWindow> = unsafe {
        let alloc: Allocated<NSWindow> = msg_send_id![class!(NSWindow), alloc];
        msg_send_id![
            alloc,
            initWithContentRect: frame
            styleMask: NSWindowStyleMask::Borderless
            backing: NSBackingStoreType::Buffered
            defer: false
        ]
    };

    // ── WKWebView ──────────────────────────────────────────────────────────
    let wk: Retained<WKWebView> = unsafe {
        let alloc: Allocated<WKWebView> = msg_send_id![class!(WKWebView), alloc];
        msg_send_id![alloc, initWithFrame: frame configuration: &*config]
    };

    unsafe {
        let _: () = msg_send![&*wk, setFrame: frame];
    }
    if let Some(content_view) = _window.contentView() {
        unsafe {
            content_view.addSubview(&*wk);
        }
    }

    // ── Start local HTTP server for subresource loading ──────────────────
    use std::io::{Read, Write};
    use std::net::TcpListener;
    use std::thread;

    let listener = TcpListener::bind("127.0.0.1:0").ok()?;
    let port = listener.local_addr().ok()?.port();
    let server_dir = resource_dir.clone();
    thread::spawn(move || {
        for stream in listener.incoming() {
            if let Ok(mut stream) = stream {
                let mut buf = [0u8; 8192];
                if stream.read(&mut buf).is_ok() {
                    let req = String::from_utf8_lossy(&buf);
                    let path = req
                        .lines()
                        .next()
                        .and_then(|l| l.split_whitespace().nth(1))
                        .unwrap_or("/index.html");
                    let rel = path.trim_start_matches('/');
                    let file_path = if rel.is_empty() || rel == "/" {
                        server_dir.join("index.html")
                    } else {
                        server_dir.join(rel)
                    };
                    let (mime, data) = if let Ok(d) = std::fs::read(&file_path) {
                        (mime_from_path(&file_path), d)
                    } else {
                        ("text/plain", b"404".to_vec())
                    };
                    let header = format!(
                        "HTTP/1.1 200 OK\r\nContent-Type: {}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                        mime, data.len()
                    );
                    let _ = stream.write_all(header.as_bytes());
                    let _ = stream.write_all(&data);
                }
            }
        }
    });

    // Small delay to ensure server is ready
    thread::sleep(std::time::Duration::from_millis(5));

    let url_str = format!("http://127.0.0.1:{}/index.html", port);
    let url = {
        let url_ns = NSString::from_str(&url_str);
        unsafe { NSURL::URLWithString(&url_ns) }
    }?;
    let request: *mut objc2::runtime::AnyObject =
        unsafe { msg_send![class!(NSURLRequest), requestWithURL: &*url] };
    unsafe {
        let _: () = msg_send![&*wk, loadRequest: request];
    }

    // ── Wait for page load ─────────────────────────────────────────────────
    let rl = unsafe { NSRunLoop::mainRunLoop() };
    let start = std::time::Instant::now();
    let max_wait = std::time::Duration::from_secs(15);

    loop {
        let is_loading: bool = unsafe { msg_send![&*wk, isLoading] };
        if !is_loading {
            break;
        }
        if start.elapsed() > max_wait {
            append_log("screenshot: timeout waiting for page load");
            return None;
        }
        let d = unsafe { NSDate::dateWithTimeIntervalSinceNow(0.05) };
        unsafe { rl.runUntilDate(&d) };
    }

    // Extra wait for JS async rendering/layout
    let d = unsafe { NSDate::dateWithTimeIntervalSinceNow(1.0) };
    unsafe { rl.runUntilDate(&d) };

    // ── Snapshot ──────────────────────────────────────────────────────────
    let done = Arc::new(AtomicBool::new(false));
    let result: Arc<std::sync::Mutex<Option<(Vec<u8>, u32, u32)>>> =
        Arc::new(std::sync::Mutex::new(None));
    let done_clone = done.clone();
    let result_clone = result.clone();

    let block = RcBlock::new(
        move |snapshot_image: *mut NSImage, _error: *mut objc2_foundation::NSError| {
            if !snapshot_image.is_null() {
                let image = unsafe { &*snapshot_image };
                if let Some(tiff_data) = unsafe { image.TIFFRepresentation() } {
                    let bitmap = unsafe {
                        NSBitmapImageRep::initWithData(NSBitmapImageRep::alloc(), &tiff_data)
                    };
                    if let Some(ref bm) = bitmap {
                        let w = unsafe { bm.pixelsWide() } as u32;
                        let h = unsafe { bm.pixelsHigh() } as u32;
                        let spp = unsafe { bm.samplesPerPixel() } as usize;
                        let bpr = unsafe { bm.bytesPerRow() } as usize;
                        let ptr = unsafe { bm.bitmapData() };
                        if !ptr.is_null() && w > 0 && h > 0 {
                            let total = (h as usize) * bpr;
                            let raw = unsafe { std::slice::from_raw_parts(ptr, total) };
                            let mut rgba = Vec::with_capacity((w * h * 4) as usize);
                            for y in 0..h as usize {
                                let row = y * bpr;
                                for x in 0..w as usize {
                                    let pos = row + x * spp;
                                    rgba.push(if pos < total { raw[pos] } else { 0 });
                                    rgba.push(if pos + 1 < total { raw[pos + 1] } else { 0 });
                                    rgba.push(if pos + 2 < total { raw[pos + 2] } else { 0 });
                                    rgba.push(if spp >= 4 && pos + 3 < total {
                                        raw[pos + 3]
                                    } else {
                                        255
                                    });
                                }
                            }
                            *result_clone.lock().unwrap() = Some((rgba, w, h));
                        }
                    }
                }
            }
            done_clone.store(true, Ordering::SeqCst);
        },
    );

    unsafe {
        wk.takeSnapshotWithConfiguration_completionHandler(None, &block);
    }

    let start = std::time::Instant::now();
    while !done.load(Ordering::SeqCst) {
        if start.elapsed() > max_wait {
            append_log("screenshot: timeout waiting for snapshot");
            return None;
        }
        let d = unsafe { NSDate::dateWithTimeIntervalSinceNow(0.05) };
        unsafe { rl.runUntilDate(&d) };
    }

    let pixels = result.lock().unwrap().take();
    pixels
}

// ─── Standalone Window helper ─────────────────────────────────────────────────

#[cfg(target_os = "macos")]
struct StandaloneWindow {
    window: cocoa::base::id,
}

#[cfg(target_os = "macos")]
impl StandaloneWindow {
    pub fn new() -> Self {
        use cocoa::base::{id, nil};
        use cocoa::foundation::{NSPoint, NSRect, NSSize};
        use objc::{class, msg_send, sel, sel_impl};

        const NS_TITLED_WINDOW_MASK: usize = 1 << 0;
        const NS_CLOSABLE_WINDOW_MASK: usize = 1 << 1;
        const NS_MINIATURIZABLE_WINDOW_MASK: usize = 1 << 2;
        const NS_RESIZABLE_WINDOW_MASK: usize = 1 << 3;
        const WINDOW_STYLE_MASK: usize = NS_TITLED_WINDOW_MASK
            | NS_CLOSABLE_WINDOW_MASK
            | NS_MINIATURIZABLE_WINDOW_MASK
            | NS_RESIZABLE_WINDOW_MASK;
        const NS_BACKING_STORE_BUFFERED: usize = 2;

        let screen: id = unsafe { msg_send![class!(NSScreen), mainScreen] };
        let screen_frame: NSRect = unsafe { msg_send![screen, frame] };
        let screen_width = screen_frame.size.width;
        let screen_height = screen_frame.size.height;

        let frame = NSRect {
            origin: NSPoint {
                x: (screen_width - DEFAULT_WIDTH as f64) / 2.0,
                y: (screen_height - DEFAULT_HEIGHT as f64) / 2.0,
            },
            size: NSSize {
                width: DEFAULT_WIDTH as f64,
                height: DEFAULT_HEIGHT as f64,
            },
        };

        let window_cls = class!(NSWindow);
        let window: id = unsafe {
            let w: id = msg_send![window_cls, alloc];
            msg_send![
                w,
                initWithContentRect: frame
                styleMask:         WINDOW_STYLE_MASK
                backing:           NS_BACKING_STORE_BUFFERED
                defer:             cocoa::base::YES
            ]
        };

        unsafe {
            let title: id = msg_send![class!(NSString), stringWithUTF8String: "Cosmo PD-101\0".as_ptr() as *const core::ffi::c_char];
            let _: () = msg_send![window, setTitle: title];
            let _: () = msg_send![window, makeKeyAndOrderFront: nil];
        }
        StandaloneWindow { window }
    }

    pub fn content_view(&self) -> *mut std::ffi::c_void {
        use cocoa::base::id;
        use objc::{msg_send, sel, sel_impl};
        let content_view: id = unsafe { msg_send![self.window, contentView] };
        content_view as *mut std::ffi::c_void
    }
}

#[cfg(target_os = "macos")]
unsafe impl Send for StandaloneWindow {}
#[cfg(target_os = "macos")]
unsafe impl Sync for StandaloneWindow {}

impl Drop for StandaloneWindow {
    fn drop(&mut self) {
        use objc::{msg_send, sel, sel_impl};
        unsafe {
            let _: () = msg_send![self.window, close];
        }
    }
}

#[cfg(target_os = "macos")]
fn is_main_thread() -> bool {
    use objc::{class, msg_send, sel, sel_impl};
    unsafe {
        let thread_class = class!(NSThread);
        let is_main: bool = msg_send![thread_class, isMainThread];
        is_main
    }
}

#[cfg(target_os = "macos")]
unsafe fn parent_has_window(ns_view: *mut std::ffi::c_void) -> bool {
    use cocoa::base::{id, nil};
    use objc::{msg_send, sel, sel_impl};
    let ns_view = ns_view as id;
    let existing_window: id = msg_send![ns_view, window];
    existing_window != nil
}

// ─── WebView builder ─────────────────────────────────────────────────────────

#[cfg(target_os = "macos")]
unsafe fn build_webview_from_ns_view(
    ns_view: *mut std::ffi::c_void,
    resource_dir: std::path::PathBuf,
    synth_params: Arc<ArcSwap<SynthParams>>,
    rt_synth_params: Arc<ArcSwap<SynthParams>>,
    synth_params_version: Arc<AtomicU64>,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    performance_counters: PerformanceCountersHandle,
    params: Arc<CzPluginParams>,
    runtime_mod_sources: SharedRuntimeModSources,
    webview_state: Arc<Mutex<WebViewContainer>>,
) -> (Option<wry::WebView>, Option<StandaloneWindow>) {
    use core::ptr::NonNull;
    use rwh_06::{
        AppKitDisplayHandle, AppKitWindowHandle, DisplayHandle, HandleError, HasDisplayHandle,
        HasWindowHandle, RawDisplayHandle, RawWindowHandle, WindowHandle,
    };
    use wry::dpi;

    struct NsViewWrapper(pub *mut std::ffi::c_void);
    impl HasWindowHandle for NsViewWrapper {
        fn window_handle(&self) -> Result<WindowHandle<'_>, HandleError> {
            let non_null = NonNull::new(self.0).expect("ns_view pointer is null");
            let handle = AppKitWindowHandle::new(non_null);
            Ok(unsafe { WindowHandle::borrow_raw(RawWindowHandle::AppKit(handle)) })
        }
    }
    impl HasDisplayHandle for NsViewWrapper {
        fn display_handle(&self) -> Result<DisplayHandle<'_>, HandleError> {
            let handle = AppKitDisplayHandle::new();
            Ok(unsafe { DisplayHandle::borrow_raw(RawDisplayHandle::AppKit(handle)) })
        }
    }
    unsafe impl Send for NsViewWrapper {}
    unsafe impl Sync for NsViewWrapper {}

    let webview_state_for_response = webview_state.clone();
    let params_repush_done = Arc::new(AtomicBool::new(false));

    let scheme = get_instance_scheme();
    append_log(&format!("webview scheme: {scheme}"));
    let builder = WebViewBuilder::new()
        .with_bounds(wry::Rect {
            position: dpi::LogicalPosition::new(0, 0).into(),
            size: dpi::LogicalSize::new(DEFAULT_WIDTH, DEFAULT_HEIGHT).into(),
        })
        .with_data_store_identifier(webview_data_store_identifier(&scheme))
        .with_custom_protocol(scheme.clone(), move |_id, request| {
            serve_file(&resource_dir, request)
        })
        .with_ipc_handler(move |request| {
            let body = request.body();
            let params_repush_done = params_repush_done.clone();

            if let Ok(msg) = serde_json::from_str::<serde_json::Value>(body) {
                let id = msg.get("id").cloned().unwrap_or(serde_json::Value::Null);
                let method = msg.get("method").and_then(|m| m.as_str()).unwrap_or("");
                let args = msg
                    .get("args")
                    .and_then(|a| a.as_array())
                    .cloned()
                    .unwrap_or_default();

                let result = handle_ipc_invoke(
                    method,
                    &args,
                    &synth_params,
                    &rt_synth_params,
                    &runtime_mod_sources,
                    &synth_params_version,
                    &scope_buffer,
                    &ui_input_queue,
                    &performance_counters,
                    &params,
                );

                let response = match result {
                    Ok(val) => serde_json::json!({ "id": id, "result": val }),
                    Err(e) => serde_json::json!({ "id": id, "error": e }),
                };

                let script = format!(
                    "window.__czIpcResponse && window.__czIpcResponse({})",
                    response
                );
                if let Ok(container) = webview_state_for_response.lock() {
                    if let Some(wv) = &container.webview {
                        let _ = wv.evaluate_script(&script);

                        if params_repush_done
                            .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
                            .is_ok()
                        {
                            let sp = synth_params.load();
                            if let Ok(json_str) = serde_json::to_string(sp.as_ref()) {
                                let escaped = json_str
                                    .replace('\\', "\\\\")
                                    .replace('"', "\\\"");
                                let params_script = format!(
                                    "if(typeof window.__czOnParams === 'function') {{ window.__czOnParams(\"{escaped}\"); }}"
                                );
                                let _ = wv.evaluate_script(&params_script);
                            }
                        }
                    }
                }
            }
        })
        .with_devtools(inspector_enabled());

    // Embed the WebView as a child of the host's NSView.
    // If the NSView is not yet associated with a window (e.g. baseview
    // window still being set up), defer — idle() will retry.
    if parent_has_window(ns_view) {
        append_log("parent NSView has a real window — embedding as child");
        let parent = NsViewWrapper(ns_view);
        let webview = builder
            .with_url(&format!("{}://localhost/", scheme))
            .build_as_child(&parent);
        match webview {
            Ok(webview) => {
                append_log("build_as_child returned — WebView created");
                (Some(webview), None)
            }
            Err(e) => {
                append_log(&format!("failed to create plugin WebView: {e}"));
                (None, None)
            }
        }
    } else {
        append_log(
            "parent NSView has no window yet — deferring WebView creation (idle() will retry)",
        );
        (None, None)
    }
}

// ─── Protocol file server ────────────────────────────────────────────────────

fn serve_file(
    resource_dir: &std::path::Path,
    request: wry::http::Request<Vec<u8>>,
) -> wry::http::Response<std::borrow::Cow<'static, [u8]>> {
    use std::fs;
    use wry::http::Response;

    let path = request.uri().path();
    let rel = path.trim_start_matches('/');
    let file_path = if rel.is_empty() {
        resource_dir.join("index.html")
    } else {
        resource_dir.join(rel)
    };

    append_log(&format!("serve_file: {}", file_path.display()));

    match fs::read(&file_path) {
        Ok(data) => {
            let mime = mime_from_path(&file_path);
            Response::builder()
                .status(200)
                .header("Content-Type", mime)
                .body(std::borrow::Cow::Owned(data))
                .unwrap()
        }
        Err(e) => {
            append_log(&format!("serve_file 404: {} — {e}", file_path.display()));
            Response::builder()
                .status(404)
                .body(std::borrow::Cow::Owned(
                    format!("not found: {}", file_path.display()).into_bytes(),
                ))
                .unwrap()
        }
    }
}

fn mime_from_path(path: &std::path::Path) -> &'static str {
    match path.extension().and_then(|e| e.to_str()) {
        Some("html") => "text/html; charset=utf-8",
        Some("js") | Some("mjs") => "application/javascript",
        Some("css") => "text/css",
        Some("wasm") => "application/wasm",
        Some("json") => "application/json",
        Some("svg") => "image/svg+xml",
        Some("png") => "image/png",
        Some("ico") => "image/x-icon",
        _ => "application/octet-stream",
    }
}

// ─── Plugin resource directory ────────────────────────────────────────────────

pub fn plugin_resource_dir() -> Option<std::path::PathBuf> {
    // Returns the webview dist path relative to the repo root (for development).
    // Called by debug_gui and as a fallback for standalone.
    fn webview_dist_path() -> Option<std::path::PathBuf> {
        let manifest = env!("CARGO_MANIFEST_DIR");
        Some(std::path::Path::new(manifest).join("webview").join("dist"))
    }

    #[cfg(feature = "debug_gui")]
    {
        let dir = webview_dist_path();
        if let Some(ref d) = dir {
            append_log(&format!("[debug_gui] resource_dir: {}", d.display()));
        }
        return dir;
    }

    #[cfg(not(feature = "debug_gui"))]
    {
        // 1. Bundle mode: walk up from binary inside .clap/.vst3/.component
        if let Some(bin_path) = binary_path() {
            let bundle_resources = bin_path
                .parent()
                .and_then(|p| p.parent())
                .map(|p| p.join("Resources").join("ui"));
            if let Some(ref d) = bundle_resources {
                append_log(&format!("[release] trying bundle path: {}", d.display()));
                if d.exists() {
                    return Some(d.clone());
                }
            }

            // 2. Standalone dev mode: look for webview dist relative to binary
            //    The binary is at target/debug/cosmo-pd101-standalone,
            //    the webview dist is at packages/cosmo-pd101-plugin/webview/dist/
            let exe_dir = bin_path.parent();
            if let Some(ref d) = exe_dir {
                // Check if we're in the package's target directory
                let webview_path = d.parent().and_then(|p| p.parent()).map(|p| {
                    p.join("packages")
                        .join("cosmo-pd101-plugin")
                        .join("webview")
                        .join("dist")
                });
                if let Some(ref w) = webview_path {
                    append_log(&format!(
                        "[release] trying standalone path: {}",
                        w.display()
                    ));
                    if w.exists() {
                        return Some(w.clone());
                    }
                }
            }
        }

        // 3. Last resort: hardcoded dev path
        let dev_path = webview_dist_path();
        if let Some(ref d) = dev_path {
            append_log(&format!("[release] trying hardcoded path: {}", d.display()));
            if d.exists() {
                return Some(d.clone());
            }
        }

        append_log("[release] WARNING: could not determine resource dir");
        None
    }
}

#[cfg(not(feature = "debug_gui"))]
fn binary_path() -> Option<std::path::PathBuf> {
    use std::ffi::CStr;

    #[repr(C)]
    struct DlInfo {
        dli_fname: *const libc::c_char,
        dli_fbase: *mut libc::c_void,
        dli_sname: *const libc::c_char,
        dli_saddr: *mut libc::c_void,
    }

    extern "C" {
        fn dladdr(addr: *const libc::c_void, info: *mut DlInfo) -> libc::c_int;
    }

    let probe = binary_path as *const libc::c_void;
    let mut info = DlInfo {
        dli_fname: std::ptr::null(),
        dli_fbase: std::ptr::null_mut(),
        dli_sname: std::ptr::null(),
        dli_saddr: std::ptr::null_mut(),
    };
    let ret = unsafe { dladdr(probe, &mut info) };
    if ret == 0 || info.dli_fname.is_null() {
        return None;
    }
    let cstr = unsafe { CStr::from_ptr(info.dli_fname) };
    let s = cstr.to_str().ok()?;
    Some(std::path::PathBuf::from(s))
}

#[allow(dead_code)]
pub fn inspector_enabled() -> bool {
    cfg!(feature = "debug_gui")
}
