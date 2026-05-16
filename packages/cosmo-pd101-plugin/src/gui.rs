//! GUI — WebView-based editor for the Cosmo PD-101 plugin.
//!
//! Implements truce's [`Editor`] trait, embedding a wry [`WebView`] as a
//! child of the host's parent window (NSView on macOS).

#![cfg_attr(target_os = "macos", allow(deprecated, unexpected_cfgs))]

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use arc_swap::ArcSwap;
use truce_core::editor::{Editor, RawWindowHandle};
use truce_core::PluginContext;
#[cfg(target_os = "macos")]
use wry::WebViewBuilder;

#[cfg(target_os = "macos")]
use cocoa;
#[cfg(target_os = "macos")]
use objc;

use crate::CzPluginParams;
use crate::handle_ipc_invoke;
use crate::{append_log, PerformanceCountersHandle, ScopeBuffer, UiInputQueue};
use cosmo_synth_engine::params::SynthParams;

// ─── Size constants ──────────────────────────────────────────────────────────

pub const DEFAULT_WIDTH: u32 = 1152;
pub const DEFAULT_HEIGHT: u32 = 864;

// ─── Per-format URL scheme ───────────────────────────────────────────────────

const WEBVIEW_SCHEME: &str = match option_env!("WRY_CUSTOM_SCHEME") {
    Some(s) => s,
    None => "cz",
};

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
    synth_params_version: Arc<AtomicU64>,
    scope_buffer: ScopeBuffer,
    ui_input_queue: UiInputQueue,
    performance_counters: PerformanceCountersHandle,
    host_scale_factor: Arc<Mutex<f32>>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    params: Arc<CzPluginParams>,
    #[cfg(target_os = "macos")]
    _temp_window: Option<TempWindow>,
}

impl CzEditor {
    pub(crate) fn new(
        synth_params: Arc<ArcSwap<SynthParams>>,
        rt_synth_params: Arc<ArcSwap<SynthParams>>,
        synth_params_version: Arc<AtomicU64>,
        scope_buffer: ScopeBuffer,
        ui_input_queue: UiInputQueue,
        performance_counters: PerformanceCountersHandle,
        params: Arc<CzPluginParams>,
    ) -> Self {
        Self {
            synth_params,
            rt_synth_params,
            synth_params_version,
            scope_buffer,
            ui_input_queue,
            performance_counters,
            host_scale_factor: Arc::new(Mutex::new(1.0)),
            webview_state: Arc::new(Mutex::new(WebViewContainer { webview: None })),
            params,
            #[cfg(target_os = "macos")]
            _temp_window: None,
        }
    }

    fn push_params(&self) {
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

    fn open(
        &mut self,
        parent: RawWindowHandle,
        _context: PluginContext,
    ) {
        append_log("CzEditor::open");

        #[cfg(not(target_os = "macos"))]
        {
            append_log("CzEditor::open: non-macOS build; no-op");
            return;
        }

        #[cfg(target_os = "macos")]
        {
            if !is_main_thread() {
                append_log(
                    "CzEditor::open called off main thread; skipping WebView creation",
                );
                return;
            }

            let ns_view = match parent {
                RawWindowHandle::AppKit(ptr) => ptr,
                _ => {
                    append_log("CzEditor::open: unsupported window handle");
                    return;
                }
            };

            let Some(resource_dir) = plugin_resource_dir() else {
                append_log(
                    "CzEditor::open: resource dir unavailable; skipping WebView creation",
                );
                return;
            };
            append_log(&format!("resource_dir: {}", resource_dir.display()));

            let synth_params = self.synth_params.clone();
            let rt_synth_params = self.rt_synth_params.clone();
            let synth_params_version = self.synth_params_version.clone();
            let scope_buffer = self.scope_buffer.clone();
            let ui_input_queue = self.ui_input_queue.clone();
            let performance_counters = self.performance_counters.clone();
            let params = self.params.clone();
            let webview_state_for_ipc = self.webview_state.clone();

            let (webview, temp_window) = unsafe {
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
                    webview_state_for_ipc.clone(),
                )
            };

            if let Ok(mut container) = self.webview_state.lock() {
                container.webview = webview;
            }

            self._temp_window = temp_window;
            self.push_params();
            self.apply_scale_normalization();
        }
    }

    fn close(&mut self) {
        append_log("CzEditor::close");
        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = None;
        }
        self._temp_window = None;
    }

    fn idle(&mut self) {
        self.push_params();
    }

    fn set_scale_factor(&mut self, factor: f64) {
        if let Ok(mut f) = self.host_scale_factor.lock() {
            *f = factor as f32;
        }
    }
}

// ─── Temporary NSWindow helper ───────────────────────────────────────────────

#[cfg(target_os = "macos")]
struct TempWindow {
    window: cocoa::base::id,
}

#[cfg(target_os = "macos")]
impl Drop for TempWindow {
    fn drop(&mut self) {
        use objc::{msg_send, sel, sel_impl};
        append_log("[TempWindow] drop: starting");

        if !is_main_thread() {
            append_log(
                "[TempWindow] drop off main thread; leaking temporary NSWindow to avoid crash",
            );
            return;
        }

        unsafe {
            let content: cocoa::base::id = msg_send![self.window, contentView];
            let subviews: cocoa::base::id = msg_send![content, subviews];
            let count: usize = msg_send![subviews, count];
            append_log(&format!("[TempWindow] drop: {count} subviews"));
            let () = msg_send![self.window, close];
        }
        append_log("[TempWindow] temporary offscreen NSWindow released");
    }
}

#[cfg(target_os = "macos")]
unsafe impl Send for TempWindow {}

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

#[cfg(target_os = "macos")]
unsafe fn wait_for_parent_window(
    ns_view: *mut std::ffi::c_void,
    timeout: std::time::Duration,
) -> bool {
    use objc::{class, msg_send, sel, sel_impl};

    let deadline = std::time::Instant::now() + timeout;
    let run_loop: cocoa::base::id = msg_send![class!(NSRunLoop), currentRunLoop];

    while std::time::Instant::now() < deadline {
        if parent_has_window(ns_view) {
            return true;
        }

        let until: cocoa::base::id =
            msg_send![class!(NSDate), dateWithTimeIntervalSinceNow: 0.01_f64];
        let _: () = msg_send![run_loop, runUntilDate: until];
    }

    parent_has_window(ns_view)
}

#[cfg(target_os = "macos")]
unsafe fn ensure_parent_has_window(ns_view: *mut std::ffi::c_void) -> Option<TempWindow> {
    use cocoa::base::{id, nil};
    use cocoa::foundation::{NSPoint, NSRect, NSSize};
    use objc::{class, msg_send, sel, sel_impl};

    if wait_for_parent_window(ns_view, std::time::Duration::from_millis(250)) {
        append_log("[TempWindow] parent NSView gained a real window during startup wait");
        return None;
    }

    let ns_view = ns_view as id;
    let existing_window: id = msg_send![ns_view, window];
    if existing_window != nil {
        return None;
    }

    append_log("[TempWindow] parent NSView still has no window after startup wait — creating temporary offscreen NSWindow");

    const NS_BORDERLESS_WINDOW_MASK: usize = 0;
    const NS_BACKING_STORE_BUFFERED: usize = 2;

    let frame = NSRect {
        origin: NSPoint {
            x: -100_000.0,
            y: -100_000.0,
        },
        size: NSSize {
            width: DEFAULT_WIDTH as f64,
            height: DEFAULT_HEIGHT as f64,
        },
    };

    let window_cls = class!(NSWindow);
    let window: id = msg_send![window_cls, alloc];
    let window: id = msg_send![
        window,
        initWithContentRect: frame
        styleMask:         NS_BORDERLESS_WINDOW_MASK
        backing:           NS_BACKING_STORE_BUFFERED
        defer:             cocoa::base::YES
    ];

    if window == nil {
        append_log("[TempWindow] ERROR: failed to create temporary NSWindow");
        return None;
    }

    let content_view: id = msg_send![window, contentView];
    let (): () = msg_send![content_view, addSubview: ns_view];

    Some(TempWindow { window })
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
    webview_state: Arc<Mutex<WebViewContainer>>,
) -> (Option<wry::WebView>, Option<TempWindow>) {
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

    let parent = NsViewWrapper(ns_view);

    let temp_window = ensure_parent_has_window(ns_view);

    let webview_state_for_response = webview_state.clone();
    let params_repush_done = Arc::new(AtomicBool::new(false));

    let webview = WebViewBuilder::new()
        .with_bounds(wry::Rect {
            position: dpi::LogicalPosition::new(0, 0).into(),
            size: dpi::LogicalSize::new(DEFAULT_WIDTH, DEFAULT_HEIGHT).into(),
        })
        .with_custom_protocol(WEBVIEW_SCHEME.to_string(), move |_id, request| {
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
        .with_devtools(inspector_enabled())
        .with_url(&format!("{}://localhost/", WEBVIEW_SCHEME))
        .build_as_child(&parent);

    match webview {
        Ok(webview) => {
            append_log("build_as_child returned — WebView created");
            (Some(webview), temp_window)
        }
        Err(e) => {
            append_log(&format!("failed to create plugin WebView: {e}"));
            (None, temp_window)
        }
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
    #[cfg(feature = "debug_gui")]
    {
        let manifest = env!("CARGO_MANIFEST_DIR");
        let repo_root = std::path::Path::new(manifest)
            .parent()
            .and_then(|p| p.parent())
            .map(|p| p.to_path_buf())
            .unwrap_or_else(|| std::path::PathBuf::from("."));
        let dir = repo_root.join("dist");
        append_log(&format!("[debug_gui] resource_dir: {}", dir.display()));
        return Some(dir);
    }

    #[cfg(not(feature = "debug_gui"))]
    {
        if let Some(dylib) = dylib_path() {
            let dir = dylib
                .parent()
                .and_then(|p| p.parent())
                .map(|p| p.join("Resources").join("ui"));
            if let Some(ref d) = dir {
                append_log(&format!("[release] resource_dir: {}", d.display()));
                if d.exists() {
                    return dir;
                }
                append_log(&format!(
                    "[release] WARNING: resource dir not found at {}",
                    d.display()
                ));
            }
        }
        append_log("[release] WARNING: could not determine resource dir");
        None
    }
}

#[cfg(not(feature = "debug_gui"))]
fn dylib_path() -> Option<std::path::PathBuf> {
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

    let probe = dylib_path as *const libc::c_void;
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
