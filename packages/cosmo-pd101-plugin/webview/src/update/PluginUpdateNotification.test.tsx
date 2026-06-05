import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PluginUpdateNotification from "./PluginUpdateNotification";

const SESSION_KEY = "cosmo-pd101.update.latestNotified";

describe("PluginUpdateNotification", () => {
	beforeEach(() => {
		sessionStorage.clear();
		vi.stubEnv("VITE_TEST_HARNESS", "1");
		window.__CZ_TEST_LATEST_RELEASE__ = {
			tag_name: "v1.2.3",
			html_url: "https://example.com/releases/v1.2.3",
			prerelease: false,
			draft: false,
		};
	});

	afterEach(() => {
		delete window.__CZ_TEST_LATEST_RELEASE__;
		vi.unstubAllEnvs();
	});

	it("shows the badge under React StrictMode", async () => {
		render(
			<StrictMode>
				<PluginUpdateNotification />
			</StrictMode>,
		);

		const badge = await screen.findByRole("link", {
			name: "New Version Available!",
		});

		expect(badge).toHaveAttribute(
			"href",
			"https://example.com/releases/v1.2.3",
		);
		expect(sessionStorage.getItem(SESSION_KEY)).toBe("1.2.3");
	});
});