const LATEST_RELEASE_URL =
	"https://api.github.com/repos/fpbrault/cosmo-pd/releases/latest";
const RELEASES_PAGE_URL = "https://github.com/fpbrault/cosmo-pd/releases";
const SESSION_KEY = "cosmo-pd101.update.latestNotified";

declare const __CZ_APP_VERSION__: string;

interface GitHubLatestReleaseResponse {
	tag_name?: string;
	html_url?: string;
	prerelease?: boolean;
	draft?: boolean;
}

declare global {
	interface Window {
		__CZ_TEST_LATEST_RELEASE__?: GitHubLatestReleaseResponse | null;
	}
}

export interface PluginUpdateInfo {
	currentVersion: string;
	latestVersion: string;
	releaseUrl: string;
	forcedByEnv?: boolean;
}

interface CheckOptions {
	manual?: boolean;
	recordNotification?: boolean;
}

function normalizeVersion(raw: string): string {
	return raw.trim().replace(/^v/i, "").split("-")[0];
}

function parseVersion(raw: string): number[] {
	return normalizeVersion(raw)
		.split(".")
		.map((part) => Number.parseInt(part, 10))
		.filter((part) => Number.isFinite(part));
}

function compareVersions(leftRaw: string, rightRaw: string): number {
	const left = parseVersion(leftRaw);
	const right = parseVersion(rightRaw);
	const maxLen = Math.max(left.length, right.length);

	for (let i = 0; i < maxLen; i += 1) {
		const l = left[i] ?? 0;
		const r = right[i] ?? 0;
		if (l > r) return 1;
		if (l < r) return -1;
	}

	return 0;
}

export function recordPluginUpdateNotification(latestVersionRaw: string): void {
	sessionStorage.setItem(SESSION_KEY, normalizeVersion(latestVersionRaw));
}

async function getLatestRelease(): Promise<GitHubLatestReleaseResponse | null> {
	if (
		import.meta.env.VITE_TEST_HARNESS === "1" &&
		typeof window !== "undefined" &&
		"__CZ_TEST_LATEST_RELEASE__" in window
	) {
		return window.__CZ_TEST_LATEST_RELEASE__ ?? null;
	}

	const response = await fetch(LATEST_RELEASE_URL, {
		headers: { Accept: "application/vnd.github+json" },
		cache: "no-store",
	});

	if (!response.ok) {
		return null;
	}

	return (await response.json()) as GitHubLatestReleaseResponse;
}

export async function checkForPluginUpdate(
	options: CheckOptions = {},
): Promise<PluginUpdateInfo | null> {
	const manual = options.manual === true;
	const forceUpdateNotifier =
		import.meta.env.VITE_FORCE_UPDATE_NOTIFIER === "1";

	try {
		const latest = await getLatestRelease();
		if (!latest) {
			if (forceUpdateNotifier) {
				return {
					currentVersion: normalizeVersion(__CZ_APP_VERSION__),
					latestVersion: "test",
					releaseUrl: RELEASES_PAGE_URL,
					forcedByEnv: true,
				};
			}
			return null;
		}

		if (
			latest.draft ||
			latest.prerelease ||
			!latest.tag_name ||
			!latest.html_url
		) {
			if (forceUpdateNotifier) {
				return {
					currentVersion: normalizeVersion(__CZ_APP_VERSION__),
					latestVersion: "test",
					releaseUrl: RELEASES_PAGE_URL,
					forcedByEnv: true,
				};
			}
			return null;
		}

		const currentVersion = normalizeVersion(__CZ_APP_VERSION__);
		const latestVersion = normalizeVersion(latest.tag_name);

		if (
			compareVersions(latestVersion, currentVersion) <= 0 &&
			!forceUpdateNotifier
		) {
			return null;
		}

		const lastNotified = sessionStorage.getItem(SESSION_KEY);
		if (!manual && !forceUpdateNotifier && lastNotified === latestVersion) {
			return null;
		}

		if (!manual && options.recordNotification !== false) {
			recordPluginUpdateNotification(latestVersion);
		}

		return {
			currentVersion,
			latestVersion: forceUpdateNotifier
				? `${latestVersion} (test)`
				: latestVersion,
			releaseUrl: latest.html_url,
			forcedByEnv: forceUpdateNotifier,
		};
	} catch {
		if (forceUpdateNotifier) {
			return {
				currentVersion: normalizeVersion(__CZ_APP_VERSION__),
				latestVersion: "test",
				releaseUrl: RELEASES_PAGE_URL,
				forcedByEnv: true,
			};
		}
		return null;
	}
}
