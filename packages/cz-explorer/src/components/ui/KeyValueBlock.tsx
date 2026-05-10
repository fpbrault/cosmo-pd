import type React from "react";
import type { ReactNode } from "react";

interface KeyValueBlockProps {
	label: string;
	value: ReactNode;
	className?: string;
}

const KeyValueBlock: React.FC<KeyValueBlockProps> = ({
	label,
	value,
	className = "",
}) => {
	return (
		<div className={className}>
			<div className="text-3xs text-base-content/40 uppercase tracking-wider">
				{label}
			</div>
			<div className="mt-1 break-all font-mono font-semibold text-xs">
				{value}
			</div>
		</div>
	);
};

export default KeyValueBlock;
