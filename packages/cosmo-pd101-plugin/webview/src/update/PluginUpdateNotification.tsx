import { memo, useEffect, useState } from "react";
import {
	checkForPluginUpdate,
	type PluginUpdateInfo,
	recordPluginUpdateNotification,
} from "./checkPluginUpdate";

export default memo(function PluginUpdateNotification() {
	const [updateInfo, setUpdateInfo] = useState<PluginUpdateInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		setIsLoading(true);

		checkForPluginUpdate({ recordNotification: false }).then((info) => {
			if (!cancelled) {
				setUpdateInfo(info);
				setIsLoading(false);
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (updateInfo && !updateInfo.forcedByEnv) {
			recordPluginUpdateNotification(updateInfo.latestVersion);
		}
	}, [updateInfo]);

	if (isLoading || !updateInfo) return null;

	return (
		<a
			href={updateInfo.releaseUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="btn btn-sm border-cz-gold/50 bg-cz-gold/5 px-2 py-1 text-cz-gold/80 no-underline hover:border-cz-gold hover:bg-cz-gold/10 hover:text-cz-gold"
		>
			New Version Available!
		</a>
	);
});
