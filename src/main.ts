import App from './views/App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
}

export default app;
