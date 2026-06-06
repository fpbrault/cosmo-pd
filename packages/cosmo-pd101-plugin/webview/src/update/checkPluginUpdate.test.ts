import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkForPluginUpdate } from "./checkPluginUpdate";

declare const __CZ_APP_VERSION__: string;

const SESSION_KEY = "cosmo-pd101.update.latestNotified";
const CURRENT_VERSION = __CZ_APP_VERSION__;
const fetchMock = vi.fn<typeof fetch>();

function mockLatestRelease(payload: Record<string, unknown>, ok = true) {
	fetchMock.mockResolvedValue({
		ok,
		json: async () => payload,
	} as Response);
}

describe("checkForPluginUpdate", () => {
	beforeEach(() => {
		sessionStorage.clear();
		fetchMock.mockReset();
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns update info for a newer stable release and stores the notified version", async () => {
		mockLatestRelease({
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
		});

		await expect(checkForPluginUpdate()).resolves.toEqual({
			currentVersion: CURRENT_VERSION,
			latestVersion: "1.2.3",
			releaseUrl: "https://example.com/releases/v1.2.3",
			forcedByEnv: false,
		});
		expect(sessionStorage.getItem(SESSION_KEY)).toBe("1.2.3");
	});

	it("suppresses duplicate automatic notifications for the same release", async () => {
		mockLatestRelease({
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
		});
		await expect(checkForPluginUpdate()).resolves.not.toBeNull();

		mockLatestRelease({
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
		});
		await expect(checkForPluginUpdate()).resolves.toBeNull();
	});

	it("allows manual checks to bypass the duplicate-notification guard", async () => {
		sessionStorage.setItem(SESSION_KEY, "1.2.3");
		mockLatestRelease({
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
		});

		await expect(checkForPluginUpdate({ manual: true })).resolves.toEqual({
			currentVersion: CURRENT_VERSION,
			latestVersion: "1.2.3",
			releaseUrl: "https://example.com/releases/v1.2.3",
			forcedByEnv: false,
		});
	});

	it("can check without recording the release as notified", async () => {
		mockLatestRelease({
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
		});

		await expect(
			checkForPluginUpdate({ recordNotification: false }),
		).resolves.toEqual({
			currentVersion: CURRENT_VERSION,
			latestVersion: "1.2.3",
			releaseUrl: "https://example.com/releases/v1.2.3",
			forcedByEnv: false,
		});
		expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
	});

	it("ignores releases that are not newer than the baked version", async () => {
		mockLatestRelease({
			tag_name: `v${CURRENT_VERSION}`,
			html_url: `https://example.com/releases/v${CURRENT_VERSION}`,
		});

		await expect(checkForPluginUpdate()).resolves.toBeNull();

		mockLatestRelease({
			tag_name: "v0.1.9",
			html_url: "https://example.com/releases/v0.1.9",
		});

		await expect(checkForPluginUpdate()).resolves.toBeNull();
	});

	it("ignores prerelease payloads", async () => {
		mockLatestRelease({
			tag_name: "v9.9.9-beta.1",
			html_url: "https://example.com/releases/v9.9.9-beta.1",
			prerelease: true,
		});

		await expect(checkForPluginUpdate()).resolves.toBeNull();
	});

	it("ignores draft payloads", async () => {
		mockLatestRelease({
			tag_name: "v9.9.9",
			html_url: "https://example.com/releases/v9.9.9",
			draft: true,
		});

		await expect(checkForPluginUpdate()).resolves.toBeNull();
	});

	it("uses the test harness override instead of fetching when present", async () => {
		vi.stubEnv("VITE_TEST_HARNESS", "1");
		window.__CZ_TEST_LATEST_RELEASE__ = {
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
			prerelease: false,
			draft: false,
		};

		await expect(checkForPluginUpdate()).resolves.toEqual({
			currentVersion: CURRENT_VERSION,
			latestVersion: "1.2.3",
			releaseUrl: "https://example.com/releases/v1.2.3",
			forcedByEnv: false,
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
