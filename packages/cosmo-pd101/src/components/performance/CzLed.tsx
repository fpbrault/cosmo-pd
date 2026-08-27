export default function CzLed({ active }: { active: boolean }) {
	return (
		<span
			aria-hidden="true"
			className={`cz-led ${active ? "on" : ""} size-1.5 shrink-0`}
		/>
	);
}
