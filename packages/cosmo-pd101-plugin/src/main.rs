use cosmo_pd101_plugin::Plugin;

fn main() {
    if std::env::var_os("TRUCE_STANDALONE_MIDI_INPUT").is_none() {
        // Let truce-standalone auto-match the first available MIDI input by
        // default in packaged standalone builds.
        unsafe {
            std::env::set_var("TRUCE_STANDALONE_MIDI_INPUT", "");
        }
    }
    truce_standalone::run::<Plugin>();
}
