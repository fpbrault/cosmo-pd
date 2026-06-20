//! Runtime and type-level guards for the plugin's realtime boundary.

use std::cell::Cell;

thread_local! {
    static IN_RT_SCOPE: Cell<bool> = const { Cell::new(false) };
}

/// Proof that the caller is executing inside the audio callback.
pub struct RtContext {
    _private: (),
}

impl RtContext {
    pub(crate) fn enter<F, R>(f: F) -> R
    where
        F: FnOnce(&RtContext) -> R,
    {
        enter_rt_scope(|| f(&Self { _private: () }))
    }
}

/// Proof that the caller is executing on a non-audio control path.
pub struct ControlContext {
    _private: (),
}

impl ControlContext {
    pub(crate) fn new() -> Self {
        assert_not_rt("construct ControlContext");
        Self { _private: () }
    }
}

struct RtScopeGuard {
    previous: bool,
}

impl Drop for RtScopeGuard {
    fn drop(&mut self) {
        IN_RT_SCOPE.with(|flag| flag.set(self.previous));
    }
}

pub fn in_rt_scope() -> bool {
    IN_RT_SCOPE.with(Cell::get)
}

pub fn enter_rt_scope<F, R>(f: F) -> R
where
    F: FnOnce() -> R,
{
    IN_RT_SCOPE.with(|flag| {
        let guard = RtScopeGuard {
            previous: flag.replace(true),
        };
        let result = f();
        drop(guard);
        result
    })
}

#[track_caller]
pub fn assert_not_rt(reason: &'static str) {
    debug_assert!(
        !in_rt_scope(),
        "RT-unsafe operation in audio callback: {reason}"
    );
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scope_is_false_outside_callback() {
        assert!(!in_rt_scope());
    }

    #[test]
    fn scope_is_true_inside_callback() {
        enter_rt_scope(|| assert!(in_rt_scope()));
        assert!(!in_rt_scope());
    }

    #[test]
    fn nested_scope_restores_previous_value() {
        enter_rt_scope(|| {
            assert!(in_rt_scope());
            enter_rt_scope(|| assert!(in_rt_scope()));
            assert!(in_rt_scope());
        });
        assert!(!in_rt_scope());
    }

    #[test]
    #[should_panic(expected = "RT-unsafe operation in audio callback")]
    fn non_rt_assertion_panics_inside_callback() {
        enter_rt_scope(|| assert_not_rt("test operation"));
    }

    #[test]
    fn scope_is_restored_after_unwind() {
        let _ = std::panic::catch_unwind(|| enter_rt_scope(|| panic!("test panic")));
        assert!(!in_rt_scope());
    }
}
