import { readFileSync } from "node:fs";

const rtFunctions = new Map([
	["packages/cosmo-pd101-plugin/src/plugin.rs", ["process", "process_rt"]],
	[
		"packages/cosmo-pd101-plugin/src/audio_runtime.rs",
		[
			"sync_runtime_params_from_host",
			"push_block_input_event",
			"handle_cc_side_effects",
			"handle_host_event_side_effects",
			"collect_block_input_events",
			"render_audio_block",
		],
	],
	[
		"packages/cosmo-synth-engine/src/processor/mod.rs",
		["copy_params_for_realtime", "apply_parameter_change_realtime"],
	],
	["packages/cosmo-synth-engine/src/processor/input.rs", ["apply_input_event"]],
]);

const forbidden = [
	[/drain_render_control_events/, "control-event drain"],
	[/persist_midi/, "MIDI persistence"],
	[/apply_factory_preset/, "factory preset application"],
	[/\.lock\s*\(/, "blocking mutex lock"],
	[/\.write\s*\(/, "blocking rwlock write"],
	[/Arc::new\s*\(/, "Arc allocation"],
	[/Arc::make_mut\s*\(/, "copy-on-write Arc mutation"],
	[/Vec::new\s*\(/, "dynamic Vec construction"],
	[/Vec::with_capacity\s*\(/, "dynamic Vec construction"],
	[/serde_json::/, "JSON work"],
	[/std::fs|File::open/, "filesystem I/O"],
	[/sync_all_daw_params_from_synth/, "DAW/control mirror publication"],
	[/build_rt_synth_params/, "full realtime parameter rebuild"],
	[/synth_params\s*\.\s*store\s*\(/, "shared synth parameter publication"],
	[/rt_synth_params\s*\.\s*store\s*\(/, "shared RT parameter publication"],
];

const extractFunction = (source, name, file) => {
	const signature = new RegExp(`\\bfn\\s+${name}\\s*\\(`, "g");
	const match = signature.exec(source);
	if (!match) {
		throw new Error(`RT safety check: missing ${name} in ${file}`);
	}

	const bodyStart = source.indexOf("{", match.index);
	if (bodyStart === -1) {
		throw new Error(`RT safety check: missing body for ${name} in ${file}`);
	}

	let depth = 0;
	for (let index = bodyStart; index < source.length; index += 1) {
		if (source[index] === "{") depth += 1;
		if (source[index] === "}") depth -= 1;
		if (depth === 0) return source.slice(match.index, index + 1);
	}
	throw new Error(`RT safety check: unterminated body for ${name} in ${file}`);
};

const violations = [];
for (const [file, names] of rtFunctions) {
	const source = readFileSync(file, "utf8");
	for (const name of names) {
		const body = extractFunction(source, name, file);
		for (const [pattern, description] of forbidden) {
			if (pattern.test(body)) {
				violations.push(`${file}::${name}: ${description}`);
			}
		}
	}
}

if (violations.length > 0) {
	console.error("Forbidden operations found in realtime functions:");
	for (const violation of violations) console.error(`- ${violation}`);
	process.exit(1);
}

console.log("RT safety static check passed.");
