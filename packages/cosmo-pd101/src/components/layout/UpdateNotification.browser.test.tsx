import { cleanup, render, screen } from "@testing-library/react/pure";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import UpdateNotification from "./UpdateNotification";

function mockGitHubResponse(
	overrides: Partial<{
		tag_name: string | undefined;
		html_url: string;
		prerelease: boolean;
		draft: boolean;
	}> = {},
) {
	return Promise.resolve(
		new Response(
			JSON.stringify({
				tag_name: "v0.2.0",
				html_url: "https://github.com/fpbrault/cosmo-pd/releases/tag/v0.2.0",
				prerelease: false,
				draft: false,
				...overrides,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		),
	);
}

describe("UpdateNotification (browser)", () => {
	let fetchSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		cleanup();
		fetchSpy = vi.spyOn(globalThis, "fetch");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("shown state", () => {
		it("shows update badge with link when newer version exists", async () => {
			fetchSpy.mockReturnValue(mockGitHubResponse({ tag_name: "v0.2.0" }));
			render(<UpdateNotification currentVersion="0.1.0" />);

			const link = await screen.findByRole("link");
			expect(link).toHaveTextContent("New Version Available!");
			expect(link).toHaveAttribute(
				"href",
				"https://github.com/fpbrault/cosmo-pd/releases/tag/v0.2.0",
			);
			expect(link).toHaveAttribute("target", "_blank");
			expect(link).toHaveAttribute("rel", "noopener noreferrer");
		});

		it("renders text label instead of version number", async () => {
			fetchSpy.mockReturnValue(mockGitHubResponse({ tag_name: "v0.3.0" }));
			render(<UpdateNotification currentVersion="0.1.0" />);

			const link = await screen.findByRole("link");
			expect(link).toHaveTextContent("New Version Available!");
		});
	});

	describe("hidden state", () => {
		it("renders nothing when version is up-to-date", async () => {
			fetchSpy.mockReturnValue(mockGitHubResponse({ tag_name: "v0.1.0" }));
			render(<UpdateNotification currentVersion="0.1.0" />);

			await vi.waitFor(() => {
				expect(screen.queryByRole("link")).not.toBeInTheDocument();
			});
			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});

		it("renders nothing on fetch failure", async () => {
			fetchSpy.mockRejectedValue(new Error("Network error"));
			render(<UpdateNotification currentVersion="0.1.0" />);

			await vi.waitFor(() => {
				expect(screen.queryByRole("link")).not.toBeInTheDocument();
			});
			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});

		it("ignores prerelease tags", async () => {
			fetchSpy.mockReturnValue(
				mockGitHubResponse({
					tag_name: "v0.2.0-beta.1",
					prerelease: true,
				}),
			);
			render(<UpdateNotification currentVersion="0.1.0" />);

			await vi.waitFor(() => {
				expect(screen.queryByRole("link")).not.toBeInTheDocument();
			});
		});

		it("ignores drafts", async () => {
			fetchSpy.mockReturnValue(
				mockGitHubResponse({ tag_name: "v0.2.0", draft: true }),
			);
			render(<UpdateNotification currentVersion="0.1.0" />);

			await vi.waitFor(() => {
				expect(screen.queryByRole("link")).not.toBeInTheDocument();
			});
		});

		it("renders nothing on non-ok response", async () => {
			fetchSpy.mockReturnValue(
				Promise.resolve(new Response(null, { status: 404 })),
			);
			render(<UpdateNotification currentVersion="0.1.0" />);

			await vi.waitFor(() => {
				expect(screen.queryByRole("link")).not.toBeInTheDocument();
			});
		});
	});

	describe("visual preview", () => {
		it("renders gold-styled update badge", async () => {
			fetchSpy.mockReturnValue(mockGitHubResponse({ tag_name: "v0.3.0" }));
			render(<UpdateNotification currentVersion="0.1.0" />);

			const link = await screen.findByRole("link");

			await page.viewport(400, 100);

			expect(link).toHaveClass("btn");
			expect(link).toHaveTextContent("New Version Available!");
		});
	});
});
