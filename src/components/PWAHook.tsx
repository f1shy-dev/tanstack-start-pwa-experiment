let registrationRef: ServiceWorkerRegistration | null = null;

export function initializePWA() {
	console.debug(process.env.NODE_ENV);
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				registrationRef = registration;
				console.log("SW registered: ", registration);

				// Check if app is ready for offline use
				if (registration.active) {
					alert("App is ready for offline use!");
				}

				// Listen for updates
				registration.addEventListener("updatefound", () => {
					const newWorker = registration.installing;
					if (newWorker) {
						newWorker.addEventListener("statechange", () => {
							if (
								newWorker.state === "installed" &&
								navigator.serviceWorker.controller
							) {
								alert("New version available! Refresh to update.");
							}
						});
					}
				});
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	}
}

export function cleanupPWA() {
	// Cleanup if needed
	if (registrationRef) {
		registrationRef = null;
	}
}

if (process.env.NODE_ENV !== "development" && typeof window !== "undefined") {
	initializePWA();
}
