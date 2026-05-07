import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FaPlay } from "react-icons/fa";
import InlineNotice from "@/components/feedback/InlineNotice";
import Button from "@/components/ui/Button";
import { useMidiChannel } from "@/context/MidiChannelContext";
import { useMidiPort } from "@/context/MidiPortContext";
import { useToast } from "@/context/ToastContext";
import { useSidebarContent } from "@/hooks/useSidebarContent";
import { getPresetFingerprint } from "@/lib/presets/presetFingerprint";
import {
	deletePreset,
	fetchPresetData,
	type Preset,
	restorePresetToBuffer,
} from "@/lib/presets/presetManager";

interface DuplicateGroup {
	fingerprint: string;
	presets: Preset[];
}

function getSuggestedKeepIndex(presets: Preset[]): number {
	const favoriteIndex = presets.findIndex((preset) => Boolean(preset.favorite));
	return favoriteIndex >= 0 ? favoriteIndex : 0;
}

export default function DuplicateFinderPage() {
	const queryClient = useQueryClient();
	const { selectedMidiPort } = useMidiPort();
	const { selectedMidiChannel } = useMidiChannel();
	const { notifyInfo, notifyError } = useToast();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [previewingGroupFingerprint, setPreviewingGroupFingerprint] = useState<
		string | null
	>(null);

	const { data: duplicatePresets = [] } = useQuery({
		queryKey: ["presets", "duplicate-review"],
		queryFn: async () => {
			const result = await fetchPresetData(
				0,
				Number.MAX_SAFE_INTEGER,
				[],
				"",
				[],
				"inclusive",
				false,
				false,
				0,
				true,
				false,
			);
			return result.presets;
		},
		refetchOnWindowFocus: false,
	});

	const groups = useMemo<DuplicateGroup[]>(() => {
		const grouped = duplicatePresets.reduce(
			(acc, preset) => {
				const key = getPresetFingerprint(preset.sysexData);
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(preset);
				return acc;
			},
			{} as Record<string, Preset[]>,
		);

		return Object.entries(grouped).map(([fingerprint, groupedPresets]) => ({
			fingerprint,
			presets: [...groupedPresets].sort((a, b) => {
				const favoriteDelta =
					Number(Boolean(b.favorite)) - Number(Boolean(a.favorite));
				if (favoriteDelta !== 0) {
					return favoriteDelta;
				}
				return a.name.localeCompare(b.name);
			}),
		}));
	}, [duplicatePresets]);

	const totalDuplicates = useMemo(
		() => groups.reduce((acc, group) => acc + group.presets.length, 0),
		[groups],
	);

	const togglePreset = (id: string) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
			return;
		}
		setSelectedIds([...selectedIds, id]);
	};

	const handleSelectAllExceptFirst = () => {
		const nextIds = groups.flatMap((group) => {
			const keepIndex = getSuggestedKeepIndex(group.presets);
			return group.presets
				.filter((_, index) => index !== keepIndex)
				.map((preset) => preset.id);
		});
		setSelectedIds(nextIds);
	};

	const handlePreviewGroup = async (group: DuplicateGroup) => {
		if (!selectedMidiPort) {
			notifyInfo("Select a MIDI port before previewing presets.");
			return;
		}

		const keepIndex = getSuggestedKeepIndex(group.presets);
		const preset = group.presets[keepIndex] ?? group.presets[0];
		if (!preset) {
			return;
		}

		setPreviewingGroupFingerprint(group.fingerprint);
		try {
			await restorePresetToBuffer(
				preset,
				selectedMidiPort,
				selectedMidiChannel,
			);
		} catch (error) {
			notifyError((error as Error).message);
		} finally {
			setPreviewingGroupFingerprint(null);
		}
	};

	useSidebarContent(
		<div className="rounded-lg bg-base-300 p-2 text-xs">
			<div>Duplicate groups: {groups.length}</div>
			<div>Total duplicate presets: {totalDuplicates}</div>
		</div>,
	);

	return (
		<div className="flex h-full min-w-0 grow overflow-hidden bg-base-300">
			<section className="flex min-w-0 grow overflow-hidden p-4 lg:p-6">
				<div className="mx-auto flex h-full w-full min-w-0 max-w-5xl flex-col overflow-hidden rounded-xl border border-base-content/15 bg-base-100 p-4 lg:p-6">
					<h1 className="font-bold text-2xl">Duplicate Finder</h1>
					<p className="mt-1 text-sm opacity-70">
						{groups.length} duplicate groups, {totalDuplicates} total duplicate
						presets.
					</p>

					<div className="mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
						{groups.length === 0 ? (
							<div>
								<InlineNotice
									message="No duplicates found."
									tone="success"
									size="md"
								/>
							</div>
						) : (
							<div className="min-w-0 space-y-3 overflow-x-hidden">
								{groups.map((group, groupIndex) => {
									const keepIndex = getSuggestedKeepIndex(group.presets);
									const previewPreset =
										group.presets[keepIndex] ?? group.presets[0];
									const isPreviewing =
										previewingGroupFingerprint === group.fingerprint;

									return (
										<div
											key={group.fingerprint}
											className="min-w-0 overflow-x-hidden rounded-lg border border-base-content/15 p-3"
										>
											<div className="mb-2 flex items-center justify-between gap-3">
												<div className="min-w-0 font-semibold text-sm">
													Group {groupIndex + 1} ({group.presets.length}{" "}
													presets)
												</div>
												<Button
													variant="info"
													size="sm"
													className="btn btn-xs shrink-0"
													onClick={() => void handlePreviewGroup(group)}
													disabled={isPreviewing || !previewPreset}
													title="Preview this duplicate group in synth buffer"
												>
													<FaPlay size={10} />
													{isPreviewing ? "Sending" : "Preview group"}
												</Button>
											</div>

											<div className="min-w-0 space-y-2 overflow-x-hidden">
												{group.presets.map((preset, presetIndex) => {
													const checked = selectedIds.includes(preset.id);

													return (
														<div
															key={preset.id}
															className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 overflow-hidden rounded-md bg-base-200/60 p-2"
														>
															<label className="flex min-w-0 cursor-pointer items-center gap-2 overflow-hidden">
																<input
																	type="checkbox"
																	className="checkbox checkbox-sm"
																	checked={checked}
																	onChange={() => togglePreset(preset.id)}
																/>
																<span className="min-w-0 truncate font-medium">
																	{preset.name}
																</span>
																{preset.favorite && (
																	<span className="badge badge-warning badge-sm">
																		Favorite
																	</span>
																)}
																<span className="min-w-0 truncate text-xs opacity-70">
																	by {preset.author || "Unknown"}
																</span>
															</label>
															<div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
																{presetIndex === keepIndex && (
																	<span className="badge badge-success badge-sm">
																		Suggested keep
																	</span>
																)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					<div className="mt-4 flex shrink-0 flex-wrap justify-end gap-2 border-base-content/10 border-t pt-4">
						<Button
							variant="neutral"
							onClick={() => setSelectedIds([])}
							disabled={isDeleting || selectedIds.length === 0}
						>
							Clear Selection
						</Button>
						<Button
							variant="accent"
							onClick={handleSelectAllExceptFirst}
							disabled={isDeleting || groups.length === 0}
						>
							Select All Except Suggested Keep
						</Button>
						<Button
							variant="error"
							disabled={isDeleting || selectedIds.length === 0}
							onClick={async () => {
								setIsDeleting(true);
								try {
									await Promise.all(selectedIds.map((id) => deletePreset(id)));
									await queryClient.invalidateQueries({
										queryKey: ["presets"],
									});
									setSelectedIds([]);
								} finally {
									setIsDeleting(false);
								}
							}}
						>
							Delete Selected ({selectedIds.length})
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
