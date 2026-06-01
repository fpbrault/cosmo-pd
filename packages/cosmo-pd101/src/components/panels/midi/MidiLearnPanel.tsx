import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/controls/Button";
import SynthPanelContainer from "@/components/layout/SynthPanelContainer";
import { getMidiLearnTargetLabel } from "@/features/synth/midiLearnRegistry";
import { useMidiLearnStore } from "@/features/synth/midiLearnStore";

function clampChannelDisplay(value: number): number {
	return Math.min(16, Math.max(1, value));
}

function clampCc(value: number): number {
	return Math.min(127, Math.max(0, value));
}

function formatControlLabel(paramKey: string): string {
	const registeredLabel = getMidiLearnTargetLabel(paramKey);
	if (registeredLabel) {
		return registeredLabel;
	}

	return paramKey
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/(\D)(\d)/g, "$1 $2")
		.replace(/(\d)(\D)/g, "$1 $2")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^./, (value) => value.toUpperCase());
}

const MidiLearnPanel = Object.assign(
	function MidiLearnPanel() {
		const learnMode = useMidiLearnStore((s) => s.learnMode);
		const setLearnMode = useMidiLearnStore((s) => s.setLearnMode);
		const bindings = useMidiLearnStore((s) => s.bindings);
		const removeBinding = useMidiLearnStore((s) => s.removeBinding);
		const addBinding = useMidiLearnStore((s) => s.addBinding);
		const resetPendingLearnParam = useMidiLearnStore(
			(s) => s.resetPendingLearnParam,
		);

		const handleToggle = useCallback(() => {
			if (learnMode) {
				setLearnMode(false);
				resetPendingLearnParam();
			} else {
				setLearnMode(true);
			}
		}, [learnMode, setLearnMode, resetPendingLearnParam]);

		const bindingList = [...bindings].sort(
			(a, b) =>
				a.channel - b.channel ||
				a.cc - b.cc ||
				a.paramKey.localeCompare(b.paramKey),
		);
		const bindingCount = bindingList.length;
		const [editingCell, setEditingCell] = useState<{
			paramKey: string;
			field: "channel" | "cc";
		} | null>(null);
		const activeEditorRef = useRef<HTMLInputElement | null>(null);

		useEffect(() => {
			if (!editingCell || !activeEditorRef.current) {
				return;
			}

			activeEditorRef.current.focus();
			activeEditorRef.current.select();
		}, [editingCell]);

		return (
			<SynthPanelContainer>
				<div className="flex h-full flex-col gap-3">
					<button
						type="button"
						onClick={handleToggle}
						className={`btn btn-xs ${
							learnMode ? "btn-error animate-pulse!" : "btn-primary"
						}`}
					>
						{learnMode ? "Midi Learn: ON" : "Midi Learn: OFF"}
					</button>

					<div className="min-h-0 w-full flex-1 overflow-visible rounded border border-cz-border/60 bg-cz-panel">
						{bindingCount > 0 ? (
							<div className="h-full overflow-visible overflow-y-auto pr-6">
								<table className="table-pin-rows table-pin-cols table-xs table w-full table-fixed">
									<thead>
										<tr className="font-mono text-[0.62rem] text-cz-cream-dim uppercase tracking-[0.14em]">
											<th className="w-6">Ch</th>
											<th className="w-10">CC</th>
											<th className="w-12">Control</th>
											<th className="w-6 px-1 py-1" />
										</tr>
									</thead>
									<tbody className="font-mono text-3xs text-cz-cream-dim">
										{bindingList.map((binding) => {
											const controlLabel = formatControlLabel(binding.paramKey);
											const isEditingChannel =
												editingCell?.paramKey === binding.paramKey &&
												editingCell.field === "channel";
											const isEditingCc =
												editingCell?.paramKey === binding.paramKey &&
												editingCell.field === "cc";
											return (
												<tr
													key={binding.paramKey}
													className="hover:bg-cz-surface/20"
												>
													<td>
														{isEditingChannel ? (
															<input
																ref={activeEditorRef}
																type="number"
																min={1}
																max={16}
																defaultValue={binding.channel + 1}
																onBlur={(event) => {
																	const newChannel =
																		clampChannelDisplay(
																			Number(event.currentTarget.value || 1),
																		) - 1;
																	removeBinding(binding.paramKey);
																	addBinding(
																		binding.paramKey,
																		newChannel,
																		binding.cc,
																	);
																	setEditingCell(null);
																}}
																onKeyDown={(event) => {
																	if (event.key === "Enter") {
																		const newChannel =
																			clampChannelDisplay(
																				Number(event.currentTarget.value || 1),
																			) - 1;
																		removeBinding(binding.paramKey);
																		addBinding(
																			binding.paramKey,
																			newChannel,
																			binding.cc,
																		);
																		setEditingCell(null);
																	}
																	if (event.key === "Escape") {
																		setEditingCell(null);
																	}
																}}
																className="h-5 w-8 rounded-sm border border-cz-border bg-cz-inset px-1 text-center font-mono text-3xs text-cz-cream leading-none outline-none focus:border-cz-light-blue"
																aria-label={`MIDI channel for ${binding.paramKey}`}
															/>
														) : (
															<button
																type="button"
																className="w-8 text-center text-cz-cream hover:text-cz-light-blue"
																onClick={() =>
																	setEditingCell({
																		paramKey: binding.paramKey,
																		field: "channel",
																	})
																}
															>
																{binding.channel + 1}
															</button>
														)}
													</td>
													<td>
														{isEditingCc ? (
															<input
																ref={activeEditorRef}
																type="number"
																min={0}
																max={127}
																defaultValue={binding.cc}
																onBlur={(event) => {
																	const newCc = clampCc(
																		Number(event.currentTarget.value || 0),
																	);
																	removeBinding(binding.paramKey);
																	addBinding(
																		binding.paramKey,
																		binding.channel,
																		newCc,
																	);
																	setEditingCell(null);
																}}
																onKeyDown={(event) => {
																	if (event.key === "Enter") {
																		const newCc = clampCc(
																			Number(event.currentTarget.value || 0),
																		);
																		removeBinding(binding.paramKey);
																		addBinding(
																			binding.paramKey,
																			binding.channel,
																			newCc,
																		);
																		setEditingCell(null);
																	}
																	if (event.key === "Escape") {
																		setEditingCell(null);
																	}
																}}
																className="h-5 w-10 rounded-sm border border-cz-border bg-cz-inset px-1 text-center font-mono text-3xs text-cz-cream leading-none outline-none focus:border-cz-light-blue"
																aria-label={`MIDI CC for ${binding.paramKey}`}
															/>
														) : (
															<button
																type="button"
																className="w-10 text-center text-cz-cream hover:text-cz-light-blue"
																onClick={() =>
																	setEditingCell({
																		paramKey: binding.paramKey,
																		field: "cc",
																	})
																}
															>
																{binding.cc}
															</button>
														)}
													</td>
													<td className="overflow-visible text-cz-cream">
														<div
															className="tooltip tooltip-right relative z-20 block max-w-full overflow-visible before:z-9999 before:max-w-none before:whitespace-nowrap before:font-mono before:text-[0.58rem] before:normal-case before:tracking-[0.06em]"
															data-tip={controlLabel}
														>
															<span className="block truncate">
																{controlLabel}
															</span>
														</div>
													</td>
													<td>
														<Button
															type="button"
															className="btn btn-xs btn-square btn-error h-5"
															onClick={() => removeBinding(binding.paramKey)}
															aria-label={`Remove MIDI binding for ${binding.paramKey}`}
														>
															X
														</Button>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<div className="flex h-full items-center justify-center text-center font-mono text-3xs text-base-content/30 uppercase tracking-[0.14em]">
								No MIDI bindings yet
							</div>
						)}
					</div>
				</div>
			</SynthPanelContainer>
		);
	},
	{
		panelId: "midi" as const,
		panelTab: { topLabel: "MIDI", bottomLabel: "Learn" },
	},
);

export default MidiLearnPanel;
