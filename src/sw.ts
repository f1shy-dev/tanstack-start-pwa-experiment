import { clientsClaim, skipWaiting } from "workbox-core";
/// <reference lib="webworker" />
import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute([
	...self.__WB_MANIFEST,
	{
		revision: "00000000000000000000000000000000",
		url: "/offline",
	},
]);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
const denylist = [/\.js$/, /\.css$/, /\/.vite\//];

// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
	new NavigationRoute(createHandlerBoundToURL("/offline"), {
		allowlist,
		denylist,
	}),
);

// self.skipWaiting();
clientsClaim();
skipWaiting();
// export {};
