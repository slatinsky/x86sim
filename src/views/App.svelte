<svelte:head>
	<!--	Bootstrap 5 -->
	<!--	https://getbootstrap.com/-->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">

	<!--	fontawesome 5-->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />
</svelte:head>

<script lang="ts">
	// clear the loader
	import Help from "./modules/help/Help.svelte";

	document.body.innerHTML = '';

	// internationalization
	import "../languages/i18n"

	// stores
	import {appState, debugMode, programs, projectName} from "../stores/stores";
	import {settings} from "../stores/stores";

	// ui
	import Navigation from "./modules/Navigation.svelte"
	import Registers from "./modules/Registers.svelte";
	import Screen from "./modules/Screen.svelte";
	import CodeEditor from "./modules/codeEditor/CodeEditor.svelte";
	import LoadSave from "./modules/loadSave/LoadSave.svelte";
	import Modal from "./components/Modal.svelte";
	import Settings from "./modules/settings/Settings.svelte";
	import Spinner from "./modules/Spinner.svelte";
	import Keyboard from "./modules/Keyboard.svelte";
	import VirtualMemory from "./modules/VirtualMemory.svelte";
	import VirtualStack from "./modules/VirtualStack.svelte";
	import Calculator from "./modules/Calculator.svelte";
	import Toasts from "./modules/Toasts.svelte";
	import {toastQueue} from "../stores/toastQueue";


	let showCalculator = false
	let showRegisters = true
	let showScreen = true
	let showKeyboard = true
	let showStack = true
	let showMemory = true
	let showCodeEditor = true

	$: {
		if ($settings.darkTheme) {
			window.document.documentElement.classList.add('dark')
		} else {
			window.document.documentElement.classList.remove('dark')
		}
		console.log('darkTheme', $settings.darkTheme)
	}


	// override ctrl+s  https://michilehr.de/overwrite-cmds-and-ctrls-in-javascript
	document.addEventListener("keydown", function (e) {
		if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
			e.preventDefault();
			toastQueue.success(`Váš projekt je automaticky ukladaný 😎`)
		}
	}, false);


	$: if ($debugMode) {
		// ask user if they want to leave the page with unsaved changes. (project is not saved in debugging mode)
		window.onbeforeunload = () => `you are currently using debugging mode and you have have unsaved changes. Press 'Reset' button to save your changes` // this message is not shown to users in modern browsers -  https://stackoverflow.com/a/37782307/14409632
	} else {
		window.onbeforeunload = null;
	}
</script>

<style>
	#grid {
		display: grid;
        grid-template-columns: clamp(300px, 30vw, 500px) clamp(500px, 10vw, 800px) 200px auto;
		gap: 15px
	}
</style>


<main>
	<Spinner />
	<Navigation />

	<div class="container-fluid">
<!--		<ShowHideModules />-->
		<div id="grid">
			{#if $settings.shownModules.showCodeEditor}
				<div>
					<CodeEditor />
				</div>
			{/if}
<!--			<div style="display: {$settings.shownModules.showCodeEditor ? 'block' : 'none'}"> &lt;!&ndash; CodeEditor doesn't support rerender, we need to just hide it &ndash;&gt;-->
<!--				<CodeEditor />-->
<!--			</div>-->
			<div>
				{#if $settings.shownModules.showCalculator}
					<Calculator />
				{/if}
				{#if $settings.shownModules.showRegisters}
					<Registers />
				{/if}
				{#if $settings.shownModules.showScreen}
					<Screen />
				{/if}
				{#if $settings.shownModules.showKeyboard}
					<Keyboard />
				{/if}
			</div>
			<div>
				{#if $settings.shownModules.showStack}
					<VirtualStack />
				{/if}
			</div>
			<div>
<!--				<div style="max-width: 50vw;word-break: break-all;">{JSON.stringify($memory)}</div>-->
				{#if $settings.shownModules.showMemory}
					<VirtualMemory />
				{/if}
			</div>
		</div>
	</div>

	<Modal bind:shown={$appState.settingsShown}>
		<Settings />
	</Modal>

	<Modal bind:shown={$appState.projectsShown}>
		<LoadSave />
	</Modal>

	<Modal bind:shown={$appState.helpShown}>
		<Help />
	</Modal>
	<Toasts />
</main>
