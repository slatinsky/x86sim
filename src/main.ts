
// use service worker only in production
let USE_SERVICE_WORKER
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
	USE_SERVICE_WORKER = false
}
else {
	USE_SERVICE_WORKER = true
}

if ('serviceWorker' in navigator) {
	if (USE_SERVICE_WORKER) {
		console.log("REGISTERING SEVICE WORKER")
		navigator.serviceWorker.register('/sw.js').then((reg) => {
			reg.update();
		});  // https://stackoverflow.com/questions/41502870/service-worker-reload-page-on-cache-update
	}
	else {
		// disable service worker - https://stackoverflow.com/a/33705250/14409632
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
		for(let registration of registrations) {
			registration.unregister()
		} })
	}

}


import App from './views/App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});


export default app;
