import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import AppLayout from "@/components/layout/AppLayout";

const PresetsPage = lazy(() => import("./PresetsPage"));
const PerformancePage = lazy(() => import("./PerformancePage"));
const SynthBackupsPage = lazy(() => import("./SynthBackupsPage"));
const SetlistsPage = lazy(() => import("./SetlistsPage"));
const TagManagerPage = lazy(() => import("./TagManagerPage"));
const DuplicateFinderPage = lazy(() => import("./DuplicateFinderPage"));
const VisualizerPage = lazy(() => import("./VisualizerPage"));
const FullscreenSynthRendererPage = lazy(
	() => import("./FullscreenSynthRendererPage"),
);

const FULLSCREEN_ROUTE_PATHS = new Set(["/synth-renderer"]);

function PageLoader() {
	return (
		<div className="flex h-full items-center justify-center">
			<span className="loading loading-spinner loading-lg" />
		</div>
	);
}

function RootLayout() {
	const location = useLocation();
	const isFullscreenRoute = FULLSCREEN_ROUTE_PATHS.has(location.pathname);

	if (isFullscreenRoute) {
		return (
			<Suspense fallback={<PageLoader />}>
				<Outlet />
			</Suspense>
		);
	}

	return (
		<AppLayout>
			<Suspense fallback={<PageLoader />}>
				<Outlet />
			</Suspense>
		</AppLayout>
	);
}

const rootRoute = createRootRoute({
	component: RootLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	beforeLoad: () => {
		throw redirect({ to: "/presets" });
	},
});

const presetsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/presets",
	component: PresetsPage,
});

const performanceRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/performance",
	component: PerformancePage,
});

const synthBackupsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/synth-backups",
	component: SynthBackupsPage,
});

const setlistsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/setlists",
	component: SetlistsPage,
});

const tagsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tags",
	component: TagManagerPage,
});

const duplicatesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/duplicates",
	component: DuplicateFinderPage,
});

const visualizerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/lab",
	component: VisualizerPage,
});

const fullscreenSynthRendererRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/synth-renderer",
	component: FullscreenSynthRendererPage,
});

export const routeTree = rootRoute.addChildren([
	indexRoute,
	presetsRoute,
	performanceRoute,
	synthBackupsRoute,
	setlistsRoute,
	tagsRoute,
	duplicatesRoute,
	visualizerRoute,
	fullscreenSynthRendererRoute,
]);

export const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export { RouterProvider };
