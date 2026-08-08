import type { PresetTagOptions } from "@/lib/synth/presetTags";

type PresetTagTone = {
	badge: string;
	badgeActive: string;
	selectOption: string;
	selectOptionSelected: string;
	multiValue: string;
	multiValueLabel: string;
	multiValueRemove: string;
};

const FALLBACK_TONE: PresetTagTone = {
	badge:
		"border border-cz-border/70 bg-cz-inset text-cz-cream hover:border-cz-light-blue/60",
	badgeActive:
		"border border-cz-light-blue/70 bg-cz-light-blue/15 text-cz-cream shadow-[inset_0_0_0_1px_rgba(140,200,255,0.2)]",
	selectOption: "bg-cz-surface text-cz-cream hover:bg-cz-inset",
	selectOptionSelected: "bg-cz-light-blue/15 text-cz-cream",
	multiValue: "border border-cz-border/70 bg-cz-inset",
	multiValueLabel: "text-cz-cream",
	multiValueRemove:
		"text-cz-cream hover:bg-cz-light-blue/15 hover:text-cz-cream",
};

const PRESET_TAG_TONES: Record<PresetTagOptions, PresetTagTone> = {
	bass: {
		badge:
			"border border-[#2f6b72] bg-[#11343a] text-[#8fe6d8] hover:border-[#5aa7a0]",
		badgeActive: "border border-[#66d5c2] bg-[#17444b] text-[#b8fff2]",
		selectOption: "bg-cz-surface text-[#8fe6d8] hover:bg-[#11343a]",
		selectOptionSelected: "bg-[#17444b] text-[#b8fff2]",
		multiValue: "border border-[#2f6b72] bg-[#11343a]",
		multiValueLabel: "text-[#b8fff2]",
		multiValueRemove: "text-[#8fe6d8] hover:bg-[#17444b] hover:text-[#d5fff8]",
	},
	bell: {
		badge:
			"border border-[#7a6a2f] bg-[#3a3311] text-[#f3d56b] hover:border-[#baa15c]",
		badgeActive: "border border-[#f3d56b] bg-[#4a4014] text-[#fff1b0]",
		selectOption: "bg-cz-surface text-[#f3d56b] hover:bg-[#3a3311]",
		selectOptionSelected: "bg-[#4a4014] text-[#fff1b0]",
		multiValue: "border border-[#7a6a2f] bg-[#3a3311]",
		multiValueLabel: "text-[#fff1b0]",
		multiValueRemove: "text-[#f3d56b] hover:bg-[#4a4014] hover:text-[#fff7cf]",
	},
	brass: {
		badge:
			"border border-[#8a4f1f] bg-[#3d1f0d] text-[#ffb36d] hover:border-[#c97a36]",
		badgeActive: "border border-[#ffb36d] bg-[#542a10] text-[#ffd1a8]",
		selectOption: "bg-cz-surface text-[#ffb36d] hover:bg-[#3d1f0d]",
		selectOptionSelected: "bg-[#542a10] text-[#ffd1a8]",
		multiValue: "border border-[#8a4f1f] bg-[#3d1f0d]",
		multiValueLabel: "text-[#ffd1a8]",
		multiValueRemove: "text-[#ffb36d] hover:bg-[#542a10] hover:text-[#ffe2c9]",
	},
	drum: {
		badge:
			"border border-[#7b3849] bg-[#34131d] text-[#ff91ae] hover:border-[#c96581]",
		badgeActive: "border border-[#ff91ae] bg-[#4a1828] text-[#ffd0dc]",
		selectOption: "bg-cz-surface text-[#ff91ae] hover:bg-[#34131d]",
		selectOptionSelected: "bg-[#4a1828] text-[#ffd0dc]",
		multiValue: "border border-[#7b3849] bg-[#34131d]",
		multiValueLabel: "text-[#ffd0dc]",
		multiValueRemove: "text-[#ff91ae] hover:bg-[#4a1828] hover:text-[#ffe4ea]",
	},
	effect: {
		badge:
			"border border-[#6340a6] bg-[#26183f] text-[#b59aff] hover:border-[#8c68e6]",
		badgeActive: "border border-[#b59aff] bg-[#34205a] text-[#e1d3ff]",
		selectOption: "bg-cz-surface text-[#b59aff] hover:bg-[#26183f]",
		selectOptionSelected: "bg-[#34205a] text-[#e1d3ff]",
		multiValue: "border border-[#6340a6] bg-[#26183f]",
		multiValueLabel: "text-[#e1d3ff]",
		multiValueRemove: "text-[#b59aff] hover:bg-[#34205a] hover:text-[#f0eaff]",
	},
	guitar: {
		badge:
			"border border-[#7a5831] bg-[#32210f] text-[#e8c38a] hover:border-[#b18553]",
		badgeActive: "border border-[#e8c38a] bg-[#453018] text-[#ffe3bc]",
		selectOption: "bg-cz-surface text-[#e8c38a] hover:bg-[#32210f]",
		selectOptionSelected: "bg-[#453018] text-[#ffe3bc]",
		multiValue: "border border-[#7a5831] bg-[#32210f]",
		multiValueLabel: "text-[#ffe3bc]",
		multiValueRemove: "text-[#e8c38a] hover:bg-[#453018] hover:text-[#fff0d8]",
	},
	keys: {
		badge:
			"border border-[#2f6085] bg-[#102536] text-[#8fd8ff] hover:border-[#5c97c9]",
		badgeActive: "border border-[#8fd8ff] bg-[#143247] text-[#d4f4ff]",
		selectOption: "bg-cz-surface text-[#8fd8ff] hover:bg-[#102536]",
		selectOptionSelected: "bg-[#143247] text-[#d4f4ff]",
		multiValue: "border border-[#2f6085] bg-[#102536]",
		multiValueLabel: "text-[#d4f4ff]",
		multiValueRemove: "text-[#8fd8ff] hover:bg-[#143247] hover:text-[#ecfbff]",
	},
	lead: {
		badge:
			"border border-[#8a2727] bg-[#3d0e0e] text-[#ff8c8c] hover:border-[#cf5c5c]",
		badgeActive: "border border-[#ff8c8c] bg-[#551515] text-[#ffd1d1]",
		selectOption: "bg-cz-surface text-[#ff8c8c] hover:bg-[#3d0e0e]",
		selectOptionSelected: "bg-[#551515] text-[#ffd1d1]",
		multiValue: "border border-[#8a2727] bg-[#3d0e0e]",
		multiValueLabel: "text-[#ffd1d1]",
		multiValueRemove: "text-[#ff8c8c] hover:bg-[#551515] hover:text-[#ffeaea]",
	},
	organ: {
		badge:
			"border border-[#4f7a2f] bg-[#1b320f] text-[#b7e886] hover:border-[#7ab153]",
		badgeActive: "border border-[#b7e886] bg-[#244516] text-[#e4ffca]",
		selectOption: "bg-cz-surface text-[#b7e886] hover:bg-[#1b320f]",
		selectOptionSelected: "bg-[#244516] text-[#e4ffca]",
		multiValue: "border border-[#4f7a2f] bg-[#1b320f]",
		multiValueLabel: "text-[#e4ffca]",
		multiValueRemove: "text-[#b7e886] hover:bg-[#244516] hover:text-[#f2ffe5]",
	},
	pad: {
		badge:
			"border border-[#2d7a6b] bg-[#10312b] text-[#84f0d6] hover:border-[#55b8a5]",
		badgeActive: "border border-[#84f0d6] bg-[#154339] text-[#d5fff4]",
		selectOption: "bg-cz-surface text-[#84f0d6] hover:bg-[#10312b]",
		selectOptionSelected: "bg-[#154339] text-[#d5fff4]",
		multiValue: "border border-[#2d7a6b] bg-[#10312b]",
		multiValueLabel: "text-[#d5fff4]",
		multiValueRemove: "text-[#84f0d6] hover:bg-[#154339] hover:text-[#ecfff9]",
	},
	piano: {
		badge:
			"border border-[#6c5d48] bg-[#2c261d] text-[#e6d4b2] hover:border-[#9e8968]",
		badgeActive: "border border-[#e6d4b2] bg-[#3a3125] text-[#fff0d4]",
		selectOption: "bg-cz-surface text-[#e6d4b2] hover:bg-[#2c261d]",
		selectOptionSelected: "bg-[#3a3125] text-[#fff0d4]",
		multiValue: "border border-[#6c5d48] bg-[#2c261d]",
		multiValueLabel: "text-[#fff0d4]",
		multiValueRemove: "text-[#e6d4b2] hover:bg-[#3a3125] hover:text-[#fff7e6]",
	},
	pluck: {
		badge:
			"border border-[#7f5a2a] bg-[#35220d] text-[#ffca76] hover:border-[#b58749]",
		badgeActive: "border border-[#ffca76] bg-[#492f12] text-[#ffe7b5]",
		selectOption: "bg-cz-surface text-[#ffca76] hover:bg-[#35220d]",
		selectOptionSelected: "bg-[#492f12] text-[#ffe7b5]",
		multiValue: "border border-[#7f5a2a] bg-[#35220d]",
		multiValueLabel: "text-[#ffe7b5]",
		multiValueRemove: "text-[#ffca76] hover:bg-[#492f12] hover:text-[#fff2d4]",
	},
	string: {
		badge:
			"border border-[#455d96] bg-[#171f39] text-[#a8bbff] hover:border-[#7088d4]",
		badgeActive: "border border-[#a8bbff] bg-[#1f2a4d] text-[#dee6ff]",
		selectOption: "bg-cz-surface text-[#a8bbff] hover:bg-[#171f39]",
		selectOptionSelected: "bg-[#1f2a4d] text-[#dee6ff]",
		multiValue: "border border-[#455d96] bg-[#171f39]",
		multiValueLabel: "text-[#dee6ff]",
		multiValueRemove: "text-[#a8bbff] hover:bg-[#1f2a4d] hover:text-[#f0f4ff]",
	},
	synth: {
		badge:
			"border border-[#6a3f7b] bg-[#291631] text-[#dea1ff] hover:border-[#a56aca]",
		badgeActive: "border border-[#dea1ff] bg-[#371d42] text-[#f1d6ff]",
		selectOption: "bg-cz-surface text-[#dea1ff] hover:bg-[#291631]",
		selectOptionSelected: "bg-[#371d42] text-[#f1d6ff]",
		multiValue: "border border-[#6a3f7b] bg-[#291631]",
		multiValueLabel: "text-[#f1d6ff]",
		multiValueRemove: "text-[#dea1ff] hover:bg-[#371d42] hover:text-[#f8ebff]",
	},
	voice: {
		badge:
			"border border-[#8a4370] bg-[#351528] text-[#ffabd8] hover:border-[#d270a8]",
		badgeActive: "border border-[#ffabd8] bg-[#471b34] text-[#ffd9ee]",
		selectOption: "bg-cz-surface text-[#ffabd8] hover:bg-[#351528]",
		selectOptionSelected: "bg-[#471b34] text-[#ffd9ee]",
		multiValue: "border border-[#8a4370] bg-[#351528]",
		multiValueLabel: "text-[#ffd9ee]",
		multiValueRemove: "text-[#ffabd8] hover:bg-[#471b34] hover:text-[#ffedf7]",
	},
	wind: {
		badge:
			"border border-[#347a5e] bg-[#112f26] text-[#88f0c1] hover:border-[#57b58b]",
		badgeActive: "border border-[#88f0c1] bg-[#174036] text-[#d4fff0]",
		selectOption: "bg-cz-surface text-[#88f0c1] hover:bg-[#112f26]",
		selectOptionSelected: "bg-[#174036] text-[#d4fff0]",
		multiValue: "border border-[#347a5e] bg-[#112f26]",
		multiValueLabel: "text-[#d4fff0]",
		multiValueRemove: "text-[#88f0c1] hover:bg-[#174036] hover:text-[#ecfff8]",
	},
};

export function getPresetTagTone(tag: string): PresetTagTone {
	return (
		(PRESET_TAG_TONES as Record<string, PresetTagTone>)[tag] ?? FALLBACK_TONE
	);
}

export function getPresetTagBadgeClassName(
	tag: string,
	active = false,
): string {
	return `badge badge-md capitalize ${active ? getPresetTagTone(tag).badgeActive : getPresetTagTone(tag).badge}`;
}

export function getPresetTagCheckboxClassName(
	tag: string,
	checked: boolean,
	disabled: boolean,
): string {
	const tone = getPresetTagTone(tag);
	const colorClasses = checked ? tone.badgeActive : tone.badge;
	return `btn btn-sm capitalize ${colorClasses}${disabled ? " opacity-30" : ""}`;
}
