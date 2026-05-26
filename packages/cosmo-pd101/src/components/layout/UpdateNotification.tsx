import { memo, useEffect, useState } from "react";
import {
	checkLatestRelease,
	type ReleaseInfo,
} from "@/lib/update/checkRelease";

type UpdateNotificationProps = {
	currentVersion: string;
};

export default memo(function UpdateNotification({
	currentVersion,
}: UpdateNotificationProps) {
	const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		setIsLoading(true);

		checkLatestRelease(currentVersion).then((info) => {
			if (!cancelled) {
				setReleaseInfo(info);
				setIsLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [currentVersion]);

	if (isLoading || !releaseInfo) return null;

	return (
		<a
			href={releaseInfo.releaseUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="btn btn-sm border-cz-gold/50 bg-cz-gold/5 px-2 py-1 text-cz-gold/80 no-underline hover:border-cz-gold hover:bg-cz-gold/10 hover:text-cz-gold"
			aria-label={`Update to version ${releaseInfo.latestVersion}`}
		>
			v{releaseInfo.latestVersion}
		</a>
	);
});
