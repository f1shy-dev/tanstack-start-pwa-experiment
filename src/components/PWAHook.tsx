import { Workbox } from "workbox-window";

if (
	"serviceWorker" in navigator &&
	typeof window !== "undefined" &&
	typeof Workbox !== "undefined"
) {
	const wb = new Workbox("/sw.js", {});

	wb.register();
}
