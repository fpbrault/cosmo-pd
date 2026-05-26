const LATEST_RELEASE_URL =
	"https://api.github.com/repos/fpbrault/cosmo-pd/releases/latest";

export interface ReleaseInfo {
	currentVersion: string;
	latestVersion: string;
	releaseUrl: string;
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

export async function checkLatestRelease(
	currentVersion: string,
): Promise<ReleaseInfo | null> {
	try {
		const response = await fetch(LATEST_RELEASE_URL, {
			headers: { Accept: "application/vnd.github+json" },
			cache: "no-store",
		});

		if (!response.ok) return null;

		const latest: {
			tag_name?: string;
			html_url?: string;
			prerelease?: boolean;
			draft?: boolean;
		} = await response.json();

		if (
			latest.draft ||
			latest.prerelease ||
			!latest.tag_name ||
			!latest.html_url
		) {
			return null;
		}

		const normalizedCurrent = normalizeVersion(currentVersion);
		const normalizedLatest = normalizeVersion(latest.tag_name);

		if (compareVersions(normalizedLatest, normalizedCurrent) <= 0) {
			return null;
		}

		return {
			currentVersion: normalizedCurrent,
			latestVersion: normalizedLatest,
			releaseUrl: latest.html_url,
		};
	} catch {
		return null;
	}
}
