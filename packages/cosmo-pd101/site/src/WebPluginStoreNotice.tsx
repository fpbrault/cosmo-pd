import { memo } from "react";

const STORE_URL = "https://store.purraudio.dev";

export default memo(function WebPluginStoreNotice() {
	return (
		<a
			href={STORE_URL}
			target="_blank"
			rel="noopener noreferrer"
			className="btn btn-sm border-cz-gold/50 bg-cz-gold/5 px-2 py-1 text-cz-gold/80 no-underline hover:border-cz-gold hover:bg-cz-gold/10 hover:text-cz-gold"
		>
			Get the Plugins
		</a>
	);
});
