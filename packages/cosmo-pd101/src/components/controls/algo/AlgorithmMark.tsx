import { PD_ALGOS } from "@/lib/synth/algoUiCatalog";
import type { PdAlgo } from "@/lib/synth/pdAlgorithms";

export default function AlgorithmMark({
	value,
	size = "standard",
}: {
	value: PdAlgo;
	size?: "standard" | "compact" | "popover";
}) {
	const definition =
		PD_ALGOS.find((algorithm) => algorithm.value === value) ?? PD_ALGOS[0];
	const className =
		size === "compact"
			? "size-14"
			: size === "popover"
				? "size-6"
				: "size-full";

	if (value === "cz101") {
		return (
			<svg
				viewBox="0 0 24 24"
				className={className}
				stroke="currentColor"
				strokeWidth="1.5"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M10.8 7.8C8.6 7.8 7.2 9.3 7.2 12C7.2 14.7 8.6 16 10.8 16" />
				<path d="M13.8 8H18L13.8 16H18" />
			</svg>
		);
	}

	return (
		<svg
			viewBox="0 0 24 24"
			className={className}
			stroke="currentColor"
			strokeWidth={size === "standard" ? ".75" : "1.5"}
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<title>{definition.label}</title>
			<path d={definition.icon} />
		</svg>
	);
}
