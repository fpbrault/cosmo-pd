import { decodeCzPatch } from "@/lib/midi/czSysexDecoder";
import type { SynthPresetV1 } from "@/lib/synth/bindings/synth";
import { convertDecodedPatchToSynthPreset } from "./czPresetConverter";

export type PresetImportFile = {
	filename: string;
	data: Uint8Array;
};

export type PreparedPresetImport = {
	filename: string;
	json: string;
};

export type PresetImportFailure = {
	filename: string;
	reason: string;
};

export type PresetImportPreparation = {
	imports: PreparedPresetImport[];
	failures: PresetImportFailure[];
};

const SYSEX_START = 0xf0;
const SYSEX_END = 0xf7;
const CASIO_MANUFACTURER_ID = 0x44;

function filenameWithoutExtension(filename: string): string {
	return filename.replace(/\.(?:json|toml|syx)$/i, "").trim() || "Imported";
}

function formatSysexName(
	baseName: string,
	index: number,
	total: number,
): string {
	if (total === 1) return baseName;
	return `${baseName} ${String(index + 1).padStart(2, "0")}`;
}

type SysexScan = {
	messages: Uint8Array[];
	incomplete: boolean;
};

function findSysexMessages(data: Uint8Array): SysexScan {
	const messages: Uint8Array[] = [];
	let offset = 0;

	while (offset < data.length) {
		const start = data.indexOf(SYSEX_START, offset);
		if (start < 0) return { messages, incomplete: false };
		const end = data.indexOf(SYSEX_END, start + 1);
		if (end < 0) return { messages, incomplete: true };
		messages.push(data.slice(start, end + 1));
		offset = end + 1;
	}

	return { messages, incomplete: false };
}

function prepareSysexFile(file: PresetImportFile): PresetImportPreparation {
	const baseName = filenameWithoutExtension(file.filename);
	const scan = findSysexMessages(file.data);
	const messages = scan.messages.length > 0 ? scan.messages : [file.data];

	if (scan.incomplete && scan.messages.length === 0) {
		return {
			imports: [],
			failures: [
				{
					filename: file.filename,
					reason: "SysEx message is missing its F7 terminator.",
				},
			],
		};
	}

	const imports: PreparedPresetImport[] = [];
	const failures: PresetImportFailure[] = [];
	if (scan.incomplete) {
		failures.push({
			filename: `${file.filename} [message ${scan.messages.length + 1}]`,
			reason: "SysEx message is missing its F7 terminator.",
		});
	}

	for (const [index, message] of messages.entries()) {
		const messageFilename =
			messages.length === 1
				? file.filename
				: `${file.filename} [message ${index + 1}]`;

		if (message[0] === SYSEX_START && message[1] !== CASIO_MANUFACTURER_ID) {
			failures.push({
				filename: messageFilename,
				reason: "Unsupported SysEx manufacturer.",
			});
			continue;
		}

		const decoded = decodeCzPatch(message);
		if (!decoded) {
			failures.push({
				filename: messageFilename,
				reason: "Invalid CZ SysEx patch.",
			});
			continue;
		}

		const data: SynthPresetV1 = convertDecodedPatchToSynthPreset(decoded);
		imports.push({
			filename: formatSysexName(baseName, index, messages.length),
			json: JSON.stringify(data),
		});
	}

	return { imports, failures };
}

export function preparePresetImportFiles(
	files: PresetImportFile[],
): PresetImportPreparation {
	const preparation: PresetImportPreparation = { imports: [], failures: [] };

	for (const file of files) {
		if (/\.syx$/i.test(file.filename)) {
			const sysexPreparation = prepareSysexFile(file);
			preparation.imports.push(...sysexPreparation.imports);
			preparation.failures.push(...sysexPreparation.failures);
			continue;
		}

		if (!/\.(?:json|toml)$/i.test(file.filename)) {
			preparation.failures.push({
				filename: file.filename,
				reason: "Unsupported preset file type.",
			});
			continue;
		}

		preparation.imports.push({
			filename: filenameWithoutExtension(file.filename),
			json: new TextDecoder().decode(file.data),
		});
	}

	return preparation;
}
