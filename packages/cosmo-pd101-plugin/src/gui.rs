//! GUI — WebView-based editor for the Cosmo PD-101 plugin.
//!
//! Implements truce's [`Editor`] trait, embedding a wry [`WebView`] as a
//! child of the host's parent window (NSView on macOS).

#![cfg_attr(
    any(target_os = "macos", target_os = "ios"),
    allow(deprecated, unexpected_cfgs)
)]

#[cfg(target_os = "macos")]
use dispatch2::run_on_main;
#[cfg(any(target_os = "macos", target_os = "ios"))]
use std::sync::atomic::AtomicBool;
use std::sync::atomic::AtomicU64;
use std::sync::atomic::Ordering;
use std::sync::{Arc, Mutex};
#[cfg(any(target_os = "macos", target_os = "ios"))]
use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
};

use arc_swap::ArcSwap;
use include_dir::{Dir, include_dir};
use truce_core::PluginContext;
use truce_core::editor::{Editor, RawWindowHandle};
#[cfg(any(target_os = "macos", target_os = "ios"))]
use wry::WebViewBuilder;
#[cfg(any(target_os = "macos", target_os = "ios"))]
use wry::WebViewBuilderExtDarwin;

use crate::CzPluginParams;
use crate::ipc::IpcContext;
#[cfg(not(any(target_os = "ios", target_os = "android")))]
use crate::runtime_state::MidiCcQueue;
use crate::runtime_state::{PluginSharedState, ScopeBuffer};
use crate::{append_log, append_log_debug, append_log_error, append_log_warn};
use cosmo_pd101_bridge_types::PluginIpcEnvelope;
use cosmo_synth_engine::params::SynthParams;

// ─── Size constants ──────────────────────────────────────────────────────────

pub const DEFAULT_WIDTH: u32 = 1152;
pub const DEFAULT_HEIGHT: u32 = 864;
pub const MIN_WIDTH: u32 = 320;
pub const MIN_HEIGHT: u32 = 240;

static EMBEDDED_WEBVIEW_DIST: Dir<'_> = include_dir!("$OUT_DIR/embedded-webview");

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

#[cfg(any(target_os = "macos", target_os = "ios"))]
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

#[derive(Clone, Debug)]
enum WebAssetSource {
    Filesystem(std::path::PathBuf),
    Embedded,
}

impl WebAssetSource {
    fn describe(&self) -> String {
        match self {
            Self::Filesystem(path) => path.display().to_string(),
            Self::Embedded => "embedded-webview-dist".to_string(),
        }
    }
}

// ─── CzEditor ────────────────────────────────────────────────────────────────

pub struct CzEditor {
    shared_state: Arc<PluginSharedState>,
    host_scale_factor: Arc<Mutex<f32>>,
    current_size: Arc<Mutex<(u32, u32)>>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    pending_parent_ns_view: Option<usize>,
    params: Arc<CzPluginParams>,
    last_midi_learn_version: u32,
    last_sent_params_json: Arc<Mutex<String>>,
    #[cfg(target_os = "macos")]
    standalone_window: Option<StandaloneWindow>,
}

impl Drop for CzEditor {
    fn drop(&mut self) {
        append_log_debug("CzEditor::drop");
        self.destroy_webview();
    }
}

impl CzEditor {
    fn destroy_webview(&mut self) {
        append_log_debug("CzEditor::destroy_webview");
        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = None;
        }
        if let Ok(mut cache) = self.last_sent_params_json.lock() {
            cache.clear();
        }
        self.last_midi_learn_version = u32::MAX;
        self.pending_parent_ns_view = None;
        self.clear_standalone_window();
    }

    #[cfg(target_os = "macos")]
    fn clear_standalone_window(&mut self) {
        self.standalone_window = None;
    }

    #[cfg(not(target_os = "macos"))]
    fn clear_standalone_window(&mut self) {}

    pub(crate) fn new(shared_state: Arc<PluginSharedState>, params: Arc<CzPluginParams>) -> Self {
        Self {
            shared_state,
            host_scale_factor: Arc::new(Mutex::new(1.0)),
            current_size: Arc::new(Mutex::new((DEFAULT_WIDTH, DEFAULT_HEIGHT))),
            webview_state: Arc::new(Mutex::new(WebViewContainer { webview: None })),
            pending_parent_ns_view: None,
            params,
            last_midi_learn_version: u32::MAX,
            last_sent_params_json: Arc::new(Mutex::new(String::new())),
            #[cfg(target_os = "macos")]
            standalone_window: None,
        }
    }

    #[cfg(any(target_os = "macos", target_os = "ios"))]
    fn has_live_webview(&self) -> bool {
        self.webview_state
            .lock()
            .map(|container| container.webview.is_some())
            .unwrap_or(false)
    }

    #[cfg(target_os = "macos")]
    fn try_create_webview(&mut self, ns_view: *mut std::ffi::c_void) -> bool {
        let Some(asset_source) = plugin_asset_source() else {
            append_log_warn(
                "CzEditor::try_create_webview: web assets unavailable; skipping WebView creation",
            );
            return false;
        };
        append_log_debug(&format!("web assets: {}", asset_source.describe()));

        let shared_state = self.shared_state.clone();
        let params = self.params.clone();
        let webview_state_for_ipc = self.webview_state.clone();
        let initial_size = self
            .current_size
            .lock()
            .map(|size| *size)
            .unwrap_or((DEFAULT_WIDTH, DEFAULT_HEIGHT));

        let (webview, standalone_window) = unsafe {
            build_webview_from_ns_view(
                ns_view,
                asset_source,
                shared_state,
                params,
                webview_state_for_ipc,
                initial_size,
            )
        };

        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = webview;
        }

        self.standalone_window = standalone_window;

        if self.has_live_webview() {
            self.pending_parent_ns_view = None;
            let _ = apply_webview_size(&self.webview_state, initial_size.0, initial_size.1);
            self.push_params();
            self.apply_scale_normalization();
            true
        } else {
            false
        }
    }

    #[cfg(target_os = "ios")]
    fn try_create_webview(&mut self, ui_view: *mut std::ffi::c_void) -> bool {
        let Some(asset_source) = plugin_asset_source() else {
            append_log_warn(
                "CzEditor::try_create_webview: web assets unavailable; skipping UIKit WebView creation",
            );
            return false;
        };
        append_log_debug(&format!("iOS web assets: {}", asset_source.describe()));

        let shared_state = self.shared_state.clone();
        let params = self.params.clone();
        let webview_state_for_ipc = self.webview_state.clone();
        let initial_size = self
            .current_size
            .lock()
            .map(|size| *size)
            .unwrap_or((DEFAULT_WIDTH, DEFAULT_HEIGHT));

        let webview = build_webview_from_ui_view(
            ui_view,
            asset_source,
            shared_state,
            params,
            webview_state_for_ipc,
            initial_size,
        );

        if let Ok(mut container) = self.webview_state.lock() {
            container.webview = webview;
        }

        if self.has_live_webview() {
            let _ = apply_webview_size(&self.webview_state, initial_size.0, initial_size.1);
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

        push_params_to_webview(
            &self.webview_state,
            &self.shared_state.synth.synth_params,
            &self.last_sent_params_json,
        );
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

        if let Ok(container) = self.webview_state.lock()
            && let Some(wv) = &container.webview
        {
            let _ = wv.evaluate_script(&script);
        }
    }

    fn push_midi_learn_state(&mut self) {
        let state = self.shared_state.midi_learn.snapshot();
        self.last_midi_learn_version = state.version;
        if let Ok(json) = serde_json::to_string(&state) {
            let escaped = json.replace('\\', "\\\\").replace('"', "\\\"");
            let script = format!(
                "if(typeof window.__czOnMidiLearnState === 'function') {{ window.__czOnMidiLearnState(\"{escaped}\"); }}"
            );
            if let Ok(container) = self.webview_state.lock()
                && let Some(wv) = &container.webview
            {
                let _ = wv.evaluate_script(&script);
            }
        }
    }
}

impl Editor for CzEditor {
    fn size(&self) -> (u32, u32) {
        self.current_size
            .lock()
            .map(|size| *size)
            .unwrap_or((DEFAULT_WIDTH, DEFAULT_HEIGHT))
    }

    fn can_resize(&self) -> bool {
        true
    }

    fn can_maximize(&self) -> bool {
        true
    }

    fn min_size(&self) -> (u32, u32) {
        (MIN_WIDTH, MIN_HEIGHT)
    }

    fn max_size(&self) -> (u32, u32) {
        (u32::MAX, u32::MAX)
    }

    fn aspect_ratio(&self) -> Option<(u32, u32)> {
        None
    }

    fn set_size(&mut self, width: u32, height: u32) -> bool {
        let width = width.max(MIN_WIDTH);
        let height = height.max(MIN_HEIGHT);
        append_log_debug(&format!("CzEditor::set_size width={width} height={height}"));
        if let Ok(mut current_size) = self.current_size.lock() {
            *current_size = (width, height);
        }

        #[cfg(target_os = "macos")]
        {
            if is_main_thread() {
                return apply_webview_size(&self.webview_state, width, height);
            }

            let webview_state = self.webview_state.clone();
            run_on_main(move |_mtm| {
                let _ = apply_webview_size(&webview_state, width, height);
            });
        }

        #[cfg(target_os = "ios")]
        {
            apply_webview_size(&self.webview_state, width, height)
        }

        #[cfg(not(target_os = "ios"))]
        true
    }

    fn screenshot(
        &mut self,
        _params: Arc<dyn truce_params::Params>,
    ) -> Option<(Vec<u8>, u32, u32)> {
        #[cfg(target_os = "macos")]
        {
            screenshot_webview()
        }
        #[cfg(not(target_os = "macos"))]
        {
            None
        }
    }

    fn open(&mut self, parent: RawWindowHandle, _context: PluginContext) {
        append_log(&format!("CzEditor::open parent={parent:?}"));

        #[cfg(not(any(target_os = "macos", target_os = "ios")))]
        {
            let _ = &parent;
            append_log_debug("CzEditor::open: unsupported platform build; no-op");
            return;
        }

        #[cfg(target_os = "macos")]
        {
            if !is_main_thread() {
                append_log_warn("CzEditor::open called off main thread; skipping WebView creation");
                return;
            }

            let ns_view = match parent {
                RawWindowHandle::AppKit(ptr) => ptr,
                _ => {
                    append_log_warn("CzEditor::open: unsupported window handle");
                    return;
                }
            };
            self.pending_parent_ns_view = Some(ns_view as usize);
            let _ = self.try_create_webview(ns_view);
        }

        #[cfg(target_os = "ios")]
        {
            let ui_view = match parent {
                RawWindowHandle::UiKit(ptr) => ptr,
                _ => {
                    append_log_warn("CzEditor::open: unsupported iOS window handle");
                    return;
                }
            };
            let _ = self.try_create_webview(ui_view);
        }
    }

    fn close(&mut self) {
        append_log("CzEditor::close");
        self.destroy_webview();
    }

    fn idle(&mut self) {
        #[cfg(target_os = "macos")]
        if !is_main_thread() {
            let should_schedule_main_thread_sync = self
                .webview_state
                .lock()
                .map(|container| container.webview.is_some())
                .unwrap_or(false);
            if !should_schedule_main_thread_sync {
                return;
            }

            let webview_state = self.webview_state.clone();
            let synth_params = self.shared_state.synth.synth_params.clone();
            let last_sent_params_json = self.last_sent_params_json.clone();
            #[cfg(not(any(target_os = "ios", target_os = "android")))]
            let midi_cc_queue = self.shared_state.ui.midi_cc_queue.clone();
            let midi_learn = self.shared_state.midi_learn.clone();
            run_on_main(move |_mtm| {
                push_params_to_webview(&webview_state, &synth_params, &last_sent_params_json);
                let events = drain_midi_cc_queue(&midi_cc_queue);
                let state = midi_learn.snapshot();
                if let Ok(json) = serde_json::to_string(&state) {
                    let escaped = json.replace('\\', "\\\\").replace('"', "\\\"");
                    let script = format!(
                        "if(typeof window.__czOnMidiLearnState === 'function') {{ window.__czOnMidiLearnState(\"{escaped}\"); }}"
                    );
                    if let Ok(container) = webview_state.lock()
                        && let Some(wv) = &container.webview
                    {
                        let _ = wv.evaluate_script(&script);
                    }
                }
                #[cfg(not(any(target_os = "ios", target_os = "android")))]
                push_midi_cc_batch_to_webview(&webview_state, &events);
            });
            return;
        }

        #[cfg(target_os = "macos")]
        if !self.has_live_webview()
            && let Some(ns_view) = self.pending_parent_ns_view
        {
            let ns_view = ns_view as *mut std::ffi::c_void;
            if unsafe { parent_has_window(ns_view) } {
                append_log_debug("idle: retrying deferred WebView creation");
                let _ = self.try_create_webview(ns_view);
            }
        }

        self.push_params();

        // Push MIDI learn state if version changed
        #[cfg(not(any(target_os = "ios", target_os = "android")))]
        let events = drain_midi_cc_queue(&self.shared_state.ui.midi_cc_queue);
        let midi_learn_state_changed =
            self.shared_state.midi_learn.version() != self.last_midi_learn_version;
        if midi_learn_state_changed {
            self.push_midi_learn_state();
        }

        #[cfg(not(any(target_os = "ios", target_os = "android")))]
        push_midi_cc_batch_to_webview(&self.webview_state, &events);
    }

    fn set_scale_factor(&mut self, factor: f64) {
        if let Ok(mut f) = self.host_scale_factor.lock() {
            *f = factor as f32;
        }
    }

    fn state_changed(&mut self) {
        if let Ok(mut cache) = self.last_sent_params_json.lock() {
            cache.clear();
        }
        self.last_midi_learn_version = u32::MAX;
        self.push_params();
        self.push_midi_learn_state();
    }
}

fn push_params_to_webview(
    webview_state: &Arc<Mutex<WebViewContainer>>,
    synth_params: &Arc<ArcSwap<SynthParams>>,
    last_sent_params_json: &Mutex<String>,
) {
    let sp = synth_params.load();
    let Ok(json_str) = serde_json::to_string(sp.as_ref()) else {
        return;
    };

    {
        let mut cache = last_sent_params_json.lock().unwrap();
        if *cache == json_str {
            return;
        }
        *cache = json_str.clone();
    }

    let escaped = json_str.replace('\\', "\\\\").replace('"', "\\\"");
    let script = format!(
        "if(typeof window.__czOnParams === 'function') {{ window.__czOnParams(\"{escaped}\"); }}"
    );
    if let Ok(container) = webview_state.lock()
        && let Some(wv) = &container.webview
    {
        let _ = wv.evaluate_script(&script);
    }
}

fn apply_webview_size(
    webview_state: &Arc<Mutex<WebViewContainer>>,
    width: u32,
    height: u32,
) -> bool {
    let Ok(container) = webview_state.lock() else {
        return false;
    };
    let Some(wv) = &container.webview else {
        return true;
    };

    let resize_result = wv.set_bounds(wry::Rect {
        position: wry::dpi::LogicalPosition::new(0, 0).into(),
        size: wry::dpi::LogicalSize::new(width, height).into(),
    });
    if let Err(error) = &resize_result {
        append_log_warn(&format!(
            "failed to resize WebView to {width}x{height}: {error}"
        ));
    }

    let _ = wv.evaluate_script(&format!(
        "window.__czHostSize = {{ width: {width}, height: {height} }}; window.dispatchEvent(new Event('resize'));"
    ));

    resize_result.is_ok()
}

#[cfg(not(any(target_os = "ios", target_os = "android")))]
fn drain_midi_cc_queue(midi_cc_queue: &MidiCcQueue) -> Vec<(u8, u8, u8)> {
    let mut events = Vec::new();
    while let Some(event) = midi_cc_queue.pop() {
        events.push(event);
    }
    events
}

#[cfg(not(any(target_os = "ios", target_os = "android")))]
fn push_midi_cc_batch_to_webview(
    webview_state: &Arc<Mutex<WebViewContainer>>,
    events: &[(u8, u8, u8)],
) {
    if events.is_empty() {
        return;
    }

    // TODO: remove this diagnostic once cross-format MIDI CC webview forwarding is verified.
    append_log_debug(&format!("flush_midi_cc_queue count={}", events.len()));

    if let Ok(container) = webview_state.lock()
        && let Some(wv) = &container.webview
    {
        let payload = serde_json::to_string(events).unwrap_or_else(|_| "[]".to_string());
        let script = format!(
            r#"if (typeof window.__czOnMidiCcBatch === 'function') {{
  window.__czOnMidiCcBatch({payload});
}} else if (typeof window.__czOnMidiCc === 'function') {{
  for (const [channel, cc, value] of {payload}) {{
    window.__czOnMidiCc(channel, cc, value);
  }}
}}"#
        );
        let _ = wv.evaluate_script(&script);
    }
}

// ─── Screenshot (macOS) ──────────────────────────────────────────────────────

#[cfg(target_os = "macos")]
fn screenshot_webview() -> Option<(Vec<u8>, u32, u32)> {
    run_on_main(|_mtm| screenshot_webview_impl())
}

/// Create a hidden WKWebView, load the plugin UI, capture a snapshot,
/// and return RGBA pixel data. Must be called on the main thread.
#[cfg(target_os = "macos")]
fn screenshot_webview_impl() -> Option<(Vec<u8>, u32, u32)> {
    use std::sync::Arc;
    use std::sync::atomic::{AtomicBool, Ordering};

    use block2::RcBlock;
    use objc2::rc::{Allocated, Retained};
    use objc2::{AnyThread, class, msg_send, msg_send_id};
    use objc2_app_kit::{
        NSBackingStoreType, NSBitmapImageRep, NSImage, NSWindow, NSWindowStyleMask,
    };
    use objc2_foundation::{NSDate, NSPoint, NSRect, NSRunLoop, NSSize, NSString, NSURL};
    use objc2_web_kit::{WKWebView, WKWebViewConfiguration};

    let asset_source = plugin_asset_source()?;
    append_log_debug(&format!("screenshot: loading {}", asset_source.describe()));

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
        content_view.addSubview(&wk);
    }

    // ── Start local HTTP server for subresource loading ──────────────────
    use std::io::{Read, Write};
    use std::net::TcpListener;
    use std::thread;

    let listener = TcpListener::bind("127.0.0.1:0").ok()?;
    let port = listener.local_addr().ok()?.port();
    let server_assets = asset_source.clone();
    thread::spawn(move || {
        for mut stream in listener.incoming().flatten() {
            let mut buf = [0u8; 8192];
            if stream.read(&mut buf).is_ok() {
                let req = String::from_utf8_lossy(&buf);
                let path = req
                    .lines()
                    .next()
                    .and_then(|l| l.split_whitespace().nth(1))
                    .unwrap_or("/index.html");
                let response = read_web_asset(&server_assets, path);
                let (status, mime, data) = if let Some(asset) = response {
                    ("200 OK", asset.mime, asset.bytes)
                } else {
                    ("404 Not Found", "text/plain", b"404".to_vec())
                };
                let header = format!(
                    "HTTP/1.1 {status}\r\nContent-Type: {mime}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                    data.len()
                );
                let _ = stream.write_all(header.as_bytes());
                let _ = stream.write_all(&data);
            }
        }
    });

    // Small delay to ensure server is ready
    thread::sleep(std::time::Duration::from_millis(5));

    let url_str = format!("http://127.0.0.1:{}/index.html", port);
    let url = {
        let url_ns = NSString::from_str(&url_str);
        NSURL::URLWithString(&url_ns)
    }?;
    let request: *mut objc2::runtime::AnyObject =
        unsafe { msg_send![class!(NSURLRequest), requestWithURL: &*url] };
    unsafe {
        let _: () = msg_send![&*wk, loadRequest: request];
    }

    // ── Wait for page load ─────────────────────────────────────────────────
    let rl = NSRunLoop::mainRunLoop();
    let start = std::time::Instant::now();
    let max_wait = std::time::Duration::from_secs(15);

    loop {
        let is_loading: bool = unsafe { msg_send![&*wk, isLoading] };
        if !is_loading {
            break;
        }
        if start.elapsed() > max_wait {
            append_log_warn("screenshot: timeout waiting for page load");
            return None;
        }
        let d = NSDate::dateWithTimeIntervalSinceNow(0.05);
        rl.runUntilDate(&d);
    }

    // Extra wait for JS async rendering/layout
    let d = NSDate::dateWithTimeIntervalSinceNow(1.0);
    rl.runUntilDate(&d);

    // ── Snapshot ──────────────────────────────────────────────────────────
    let done = Arc::new(AtomicBool::new(false));
    #[allow(clippy::type_complexity)]
    let result: Arc<Mutex<Option<(Vec<u8>, u32, u32)>>> = Arc::new(Mutex::new(None));
    let done_clone = done.clone();
    let result_clone = result.clone();

    let block = RcBlock::new(
        move |snapshot_image: *mut NSImage, _error: *mut objc2_foundation::NSError| {
            if !snapshot_image.is_null() {
                let image = unsafe { &*snapshot_image };
                if let Some(tiff_data) = image.TIFFRepresentation() {
                    let bitmap =
                        NSBitmapImageRep::initWithData(NSBitmapImageRep::alloc(), &tiff_data);
                    if let Some(ref bm) = bitmap {
                        let w = bm.pixelsWide() as u32;
                        let h = bm.pixelsHigh() as u32;
                        let spp = bm.samplesPerPixel() as usize;
                        let bpr = bm.bytesPerRow() as usize;
                        let ptr = bm.bitmapData();
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
            append_log_warn("screenshot: timeout waiting for snapshot");
            return None;
        }
        let d = NSDate::dateWithTimeIntervalSinceNow(0.05);
        rl.runUntilDate(&d);
    }

    result.lock().unwrap().take()
}

// ─── Standalone Window helper ─────────────────────────────────────────────────

#[cfg(target_os = "macos")]
struct StandaloneWindow {
    window: cocoa::base::id,
    #[allow(dead_code)]
    delegate: cocoa::base::id,
}

#[cfg(target_os = "macos")]
fn terminate_delegate_class() -> &'static objc::runtime::Class {
    use objc::{class, declare::ClassDecl, msg_send, sel, sel_impl};
    static CLASS: std::sync::OnceLock<&'static objc::runtime::Class> = std::sync::OnceLock::new();
    CLASS.get_or_init(|| {
        let mut decl = ClassDecl::new("StandaloneWindowCloseDelegate", class!(NSObject))
            .expect("failed to create delegate class");
        extern "C" fn window_should_close(
            _this: &objc::runtime::Object,
            _cmd: objc::runtime::Sel,
            _sender: *mut objc::runtime::Object,
        ) -> objc::runtime::BOOL {
            unsafe {
                let app: *mut objc::runtime::Object =
                    msg_send![class!(NSApplication), sharedApplication];
                let nil_sender: *mut objc::runtime::Object = std::ptr::null_mut();
                let _: () = msg_send![app, terminate: nil_sender];
            }
            objc::runtime::YES
        }
        unsafe {
            decl.add_method(
                sel!(windowShouldClose:),
                window_should_close
                    as extern "C" fn(
                        &objc::runtime::Object,
                        objc::runtime::Sel,
                        *mut objc::runtime::Object,
                    ) -> objc::runtime::BOOL,
            );
            decl.register()
        }
    });
    CLASS.get().unwrap()
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
            let title: id =
                msg_send![class!(NSString), stringWithUTF8String: c"Cosmo PD-101".as_ptr()];
            let _: () = msg_send![window, setTitle: title];
            let _: () = msg_send![window, makeKeyAndOrderFront: nil];
        }

        let delegate = unsafe {
            let cls = terminate_delegate_class();
            let d: id = msg_send![cls, new];
            let _: () = msg_send![window, setDelegate: d];
            d
        };

        let standalone = StandaloneWindow { window, delegate };
        standalone.hide_other_windows();
        standalone
    }

    pub fn hide_other_windows(&self) {
        use cocoa::base::nil as cocoa_nil;
        use objc::{class, msg_send, sel, sel_impl};
        unsafe {
            let app: cocoa::base::id = msg_send![class!(NSApplication), sharedApplication];
            let windows: cocoa::base::id = msg_send![app, windows];
            let count: usize = msg_send![windows, count];
            for i in 0..count {
                let w: cocoa::base::id = msg_send![windows, objectAtIndex: i];
                if w != self.window && w != cocoa_nil {
                    let _: () = msg_send![w, orderOut: cocoa_nil];
                }
            }
        }
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

#[cfg(target_os = "macos")]
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

#[cfg(target_os = "macos")]
fn is_standalone_mode() -> bool {
    std::env::current_exe()
        .map(|p| p.to_string_lossy().contains("standalone"))
        .unwrap_or(false)
}

// ─── WebView builder ─────────────────────────────────────────────────────────

#[cfg(any(target_os = "macos", target_os = "ios"))]
struct NativeViewWrapper(pub *mut std::ffi::c_void);

#[cfg(target_os = "macos")]
impl raw_window_handle::HasWindowHandle for NativeViewWrapper {
    fn window_handle(
        &self,
    ) -> Result<raw_window_handle::WindowHandle<'_>, raw_window_handle::HandleError> {
        use core::ptr::NonNull;
        use raw_window_handle::{AppKitWindowHandle, RawWindowHandle, WindowHandle};

        let non_null = NonNull::new(self.0).expect("native view pointer is null");
        let handle = AppKitWindowHandle::new(non_null);
        Ok(unsafe { WindowHandle::borrow_raw(RawWindowHandle::AppKit(handle)) })
    }
}

#[cfg(target_os = "macos")]
impl raw_window_handle::HasDisplayHandle for NativeViewWrapper {
    fn display_handle(
        &self,
    ) -> Result<raw_window_handle::DisplayHandle<'_>, raw_window_handle::HandleError> {
        use raw_window_handle::{AppKitDisplayHandle, DisplayHandle, RawDisplayHandle};

        let handle = AppKitDisplayHandle::new();
        Ok(unsafe { DisplayHandle::borrow_raw(RawDisplayHandle::AppKit(handle)) })
    }
}

#[cfg(target_os = "ios")]
impl raw_window_handle::HasWindowHandle for NativeViewWrapper {
    fn window_handle(
        &self,
    ) -> Result<raw_window_handle::WindowHandle<'_>, raw_window_handle::HandleError> {
        use core::ptr::NonNull;
        use raw_window_handle::{RawWindowHandle, UiKitWindowHandle, WindowHandle};

        let non_null = NonNull::new(self.0).expect("native view pointer is null");
        let handle = UiKitWindowHandle::new(non_null);
        Ok(unsafe { WindowHandle::borrow_raw(RawWindowHandle::UiKit(handle)) })
    }
}

#[cfg(target_os = "ios")]
impl raw_window_handle::HasDisplayHandle for NativeViewWrapper {
    fn display_handle(
        &self,
    ) -> Result<raw_window_handle::DisplayHandle<'_>, raw_window_handle::HandleError> {
        use raw_window_handle::{DisplayHandle, RawDisplayHandle, UiKitDisplayHandle};

        let handle = UiKitDisplayHandle::new();
        Ok(unsafe { DisplayHandle::borrow_raw(RawDisplayHandle::UiKit(handle)) })
    }
}

#[cfg(any(target_os = "macos", target_os = "ios"))]
unsafe impl Send for NativeViewWrapper {}
#[cfg(any(target_os = "macos", target_os = "ios"))]
unsafe impl Sync for NativeViewWrapper {}

#[cfg(any(target_os = "macos", target_os = "ios"))]
fn create_webview_builder(
    asset_source: WebAssetSource,
    shared_state: Arc<PluginSharedState>,
    params: Arc<CzPluginParams>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    initial_size: (u32, u32),
) -> WebViewBuilder<'static> {
    use wry::dpi;

    let webview_state_for_response = webview_state.clone();
    let params_repush_done = Arc::new(AtomicBool::new(false));
    let ipc_context = IpcContext::new(shared_state.clone(), params);

    let scheme = get_instance_scheme();
    append_log_debug(&format!("webview scheme: {scheme}"));

    let scope_for_protocol = shared_state.telemetry.scope_buffer.clone();
    WebViewBuilder::new()
        .with_bounds(wry::Rect {
            position: dpi::LogicalPosition::new(0, 0).into(),
            size: dpi::LogicalSize::new(initial_size.0, initial_size.1).into(),
        })
        .with_data_store_identifier(webview_data_store_identifier(&scheme))
        .with_custom_protocol(scheme.clone(), move |_id, request| {
            let path = request.uri().path();
            if path == "/__scope__" {
                return serve_scope_buffer(&scope_for_protocol);
            }
            serve_file(&asset_source, request)
        })
        .with_ipc_handler(move |request| {
            let body = request.body();
            let params_repush_done = params_repush_done.clone();

            if let Ok(msg) = serde_json::from_str::<serde_json::Value>(body) {
                let id = msg.get("id").cloned().unwrap_or(serde_json::Value::Null);
                let method_name = msg
                    .get("method")
                    .and_then(|m| m.as_str())
                    .unwrap_or("")
                    .to_string();

                let result = serde_json::from_value::<PluginIpcEnvelope>(msg)
                    .map_err(|error| format!("invalid IPC envelope: {error}"))
                    .and_then(|envelope| ipc_context.invoke_envelope(&envelope))
                    .and_then(|response| response.into_result().map_err(|error| error.to_string()));

                if let Err(error) = &result {
                    append_log_warn(&format!("ipc error method={method_name}: {error}"));
                }

                let response = match result {
                    Ok(val) => serde_json::json!({ "id": id, "result": val }),
                    Err(e) => serde_json::json!({ "id": id, "error": e }),
                };

                let script = format!(
                    "window.__czIpcResponse && window.__czIpcResponse({})",
                    response
                );
                if let Ok(container) = webview_state_for_response.lock()
                    && let Some(wv) = &container.webview
                {
                    let _ = wv.evaluate_script(&script);

                    if params_repush_done
                        .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
                        .is_ok()
                    {
                        let sp = shared_state.synth.synth_params.load();
                        if let Ok(json_str) = serde_json::to_string(sp.as_ref()) {
                            let escaped = json_str.replace('\\', "\\\\").replace('"', "\\\"");
                            let params_script = format!(
                                "if(typeof window.__czOnParams === 'function') {{ window.__czOnParams(\"{escaped}\"); }}"
                            );
                            let _ = wv.evaluate_script(&params_script);
                        }
                    }
                }
            }
        })
        .with_devtools(inspector_enabled())
        .with_url(format!("{}://localhost/", scheme))
}

#[cfg(any(target_os = "macos", target_os = "ios"))]
fn build_webview_from_parent_view(
    parent_view: *mut std::ffi::c_void,
    asset_source: WebAssetSource,
    shared_state: Arc<PluginSharedState>,
    params: Arc<CzPluginParams>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    initial_size: (u32, u32),
    log_label: &str,
) -> Option<wry::WebView> {
    let builder = create_webview_builder(
        asset_source,
        shared_state,
        params,
        webview_state,
        initial_size,
    );
    let parent = NativeViewWrapper(parent_view);
    match builder.build_as_child(&parent) {
        Ok(webview) => {
            append_log(&format!(
                "{log_label}: WebView created in native parent view"
            ));
            Some(webview)
        }
        Err(error) => {
            append_log_error(&format!("{log_label}: failed to create WebView: {error}"));
            None
        }
    }
}

#[cfg(target_os = "macos")]
unsafe fn build_webview_from_ns_view(
    ns_view: *mut std::ffi::c_void,
    asset_source: WebAssetSource,
    shared_state: Arc<PluginSharedState>,
    params: Arc<CzPluginParams>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    initial_size: (u32, u32),
) -> (Option<wry::WebView>, Option<StandaloneWindow>) {
    unsafe {
        // ── DECISION POINT ──
        if parent_has_window(ns_view) {
            // BRANCH A: ns_view already has an associated NSWindow (DAW mode).
            // Embed webview as child of the existing window.
            append_log_debug("parent NSView has a real window — embedding as child");
            let webview = build_webview_from_parent_view(
                ns_view,
                asset_source,
                shared_state,
                params,
                webview_state,
                initial_size,
                "plugin",
            );
            (webview, None)
        } else if is_standalone_mode() {
            // BRANCH B: standalone binary — create our own window (hides baseview
            // window from truce-standalone) and embed the WebView inside it.
            append_log_debug("standalone mode — creating standalone NSWindow");
            let standalone_window = StandaloneWindow::new();
            let content_view = standalone_window.content_view();

            // Allow a tick for the NSView/NSWindow association to settle.
            let mut attempts = 0;
            while !parent_has_window(content_view) && attempts < 10 {
                std::thread::sleep(std::time::Duration::from_millis(10));
                attempts += 1;
            }

            let webview = build_webview_from_parent_view(
                content_view,
                asset_source,
                shared_state,
                params,
                webview_state,
                initial_size,
                "standalone",
            );
            (webview, Some(standalone_window))
        } else {
            // BRANCH C: no window association AND not standalone — defer.
            // idle() will retry when the host window finishes setting up.
            append_log_debug(
                "parent NSView has no window — deferring WebView creation (idle() will retry)",
            );
            (None, None)
        }
    }
}

#[cfg(target_os = "ios")]
fn build_webview_from_ui_view(
    ui_view: *mut std::ffi::c_void,
    asset_source: WebAssetSource,
    shared_state: Arc<PluginSharedState>,
    params: Arc<CzPluginParams>,
    webview_state: Arc<Mutex<WebViewContainer>>,
    initial_size: (u32, u32),
) -> Option<wry::WebView> {
    append_log_debug("UIKit parent view received - embedding WebView as child");
    build_webview_from_parent_view(
        ui_view,
        asset_source,
        shared_state,
        params,
        webview_state,
        initial_size,
        "plugin",
    )
}

// ─── Protocol file server ────────────────────────────────────────────────────

struct WebAssetResponse {
    mime: &'static str,
    bytes: Vec<u8>,
}

fn serve_scope_buffer(
    scope_buffer: &ScopeBuffer,
) -> wry::http::Response<std::borrow::Cow<'static, [u8]>> {
    use wry::http::Response;

    let frame = match scope_buffer.try_lock() {
        Ok(frame) => frame,
        Err(_) => {
            return Response::builder()
                .status(200)
                .header("Content-Type", "application/octet-stream")
                .header("Content-Length", "8")
                .header("Access-Control-Allow-Origin", "*")
                .body(std::borrow::Cow::Owned(vec![0u8; 8]))
                .unwrap();
        }
    };

    let linear = frame.to_linear();
    let sample_rate = frame.sample_rate();
    let hz = frame.hz();

    let mut buf = Vec::with_capacity(8 + linear.len() * 4);
    buf.extend_from_slice(&sample_rate.to_le_bytes());
    buf.extend_from_slice(&hz.to_le_bytes());
    for &s in &linear {
        buf.extend_from_slice(&s.to_le_bytes());
    }

    Response::builder()
        .status(200)
        .header("Content-Type", "application/octet-stream")
        .header("Content-Length", buf.len().to_string())
        .header("Access-Control-Allow-Origin", "*")
        .body(std::borrow::Cow::Owned(buf))
        .unwrap()
}

fn serve_file(
    asset_source: &WebAssetSource,
    request: wry::http::Request<Vec<u8>>,
) -> wry::http::Response<std::borrow::Cow<'static, [u8]>> {
    use wry::http::Response;

    let path = request.uri().path();
    append_log_debug(&format!("serve_file: {}", path));

    if let Some(asset) = read_web_asset(asset_source, path) {
        return Response::builder()
            .status(200)
            .header("Content-Type", asset.mime)
            .body(std::borrow::Cow::Owned(asset.bytes))
            .unwrap();
    }

    append_log_warn(&format!("serve_file 404: {path}"));
    Response::builder()
        .status(404)
        .body(std::borrow::Cow::Owned(
            format!("not found: {path}").into_bytes(),
        ))
        .unwrap()
}

fn read_web_asset(asset_source: &WebAssetSource, request_path: &str) -> Option<WebAssetResponse> {
    let rel = request_path.trim_start_matches('/');
    let rel = if rel.is_empty() { "index.html" } else { rel };

    match asset_source {
        WebAssetSource::Filesystem(root) => {
            let file_path = root.join(rel);
            std::fs::read(&file_path)
                .ok()
                .map(|bytes| WebAssetResponse {
                    mime: mime_from_rel_path(rel),
                    bytes,
                })
        }
        WebAssetSource::Embedded => {
            EMBEDDED_WEBVIEW_DIST
                .get_file(rel)
                .map(|file| WebAssetResponse {
                    mime: mime_from_rel_path(rel),
                    bytes: file.contents().to_vec(),
                })
        }
    }
}

fn mime_from_rel_path(path: &str) -> &'static str {
    mime_from_path(std::path::Path::new(path))
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

fn has_embedded_web_assets() -> bool {
    EMBEDDED_WEBVIEW_DIST.get_file("index.html").is_some()
}

fn plugin_asset_source() -> Option<WebAssetSource> {
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
            append_log_debug(&format!("[debug_gui] resource_dir: {}", d.display()));
        }
        return dir.map(WebAssetSource::Filesystem);
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
                append_log_debug(&format!("[release] trying bundle path: {}", d.display()));
                if d.exists() {
                    return Some(WebAssetSource::Filesystem(d.clone()));
                }
            }

            // 2. Standalone dev mode: look for webview dist relative to binary
            //    The binary is at target/debug/cosmo-pd101-standalone,
            //    the webview dist is at packages/cosmo-pd101-plugin/webview/dist/
            let exe_dir = bin_path.parent();
            if let Some(d) = exe_dir {
                // Check if we're in the package's target directory
                let webview_path = d.parent().and_then(|p| p.parent()).map(|p| {
                    p.join("packages")
                        .join("cosmo-pd101-plugin")
                        .join("webview")
                        .join("dist")
                });
                if let Some(ref w) = webview_path {
                    append_log_debug(&format!(
                        "[release] trying standalone path: {}",
                        w.display()
                    ));
                    if w.exists() {
                        return Some(WebAssetSource::Filesystem(w.clone()));
                    }
                }
            }
        }

        // 3. Last resort: hardcoded dev path
        let dev_path = webview_dist_path();
        if let Some(ref d) = dev_path {
            append_log_debug(&format!("[release] trying hardcoded path: {}", d.display()));
            if d.exists() {
                return Some(WebAssetSource::Filesystem(d.clone()));
            }
        }

        if has_embedded_web_assets() {
            append_log("using embedded web assets");
            return Some(WebAssetSource::Embedded);
        }

        append_log_warn("could not determine web assets");
        None
    }
}

#[cfg(not(feature = "debug_gui"))]
fn binary_path() -> Option<std::path::PathBuf> {
    #[cfg(target_os = "windows")]
    {
        use std::ffi::OsString;
        use std::os::windows::ffi::OsStringExt;
        use std::ptr::null_mut;

        #[repr(C)]
        struct HINSTANCE__(isize);

        type HMODULE = *mut HINSTANCE__;
        type DWORD = u32;
        type LPCWSTR = *const u16;
        type LPWSTR = *mut u16;
        type BOOL = i32;

        const GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS: DWORD = 0x00000004;
        const GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT: DWORD = 0x00000002;

        unsafe extern "system" {
            fn GetModuleHandleExW(
                dwFlags: DWORD,
                lpModuleName: LPCWSTR,
                phModule: *mut HMODULE,
            ) -> BOOL;
            fn GetModuleFileNameW(hModule: HMODULE, lpFilename: LPWSTR, nSize: DWORD) -> DWORD;
        }

        let mut module: HMODULE = null_mut();
        // SAFETY: We pass a valid function pointer address to GetModuleHandleExW
        unsafe {
            if GetModuleHandleExW(
                GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS
                    | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
                binary_path as *const std::ffi::c_void as LPCWSTR,
                &mut module,
            ) == 0
            {
                return None;
            }
            let mut buf = [0u16; 4096];
            let len = GetModuleFileNameW(module, buf.as_mut_ptr(), buf.len() as DWORD);
            if len == 0 {
                return None;
            }
            let s = OsString::from_wide(&buf[..len as usize]);
            Some(std::path::PathBuf::from(s))
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        use std::ffi::CStr;

        #[repr(C)]
        struct DlInfo {
            dli_fname: *const libc::c_char,
            dli_fbase: *mut libc::c_void,
            dli_sname: *const libc::c_char,
            dli_saddr: *mut libc::c_void,
        }

        unsafe extern "C" {
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
}

#[allow(dead_code)]
pub fn inspector_enabled() -> bool {
    cfg!(feature = "debug_gui")
}
