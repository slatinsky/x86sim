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
	import {appState} from "../stores/stores";
	import {settings} from "../stores/stores";

	// ui
	import Navigation from "./modules/Navigation.svelte"
	import Registers from "./modules/Registers.svelte";
	import Screen from "./modules/Screen.svelte";
	import CodeEditor from "./modules/codeEditor/CodeEditor.svelte";
	import LoadSave from "./modules/loadSave/LoadSave.svelte";
	import Modal from "./components/Modal.svelte";
	import Settings from "./modules/Settings.svelte";
	import Spinner from "./modules/Spinner.svelte";
	import Keyboard from "./modules/Keyboard.svelte";
	import VirtualMemory from "./modules/VirtualMemory.svelte";
	import VirtualStack from "./modules/VirtualStack.svelte";
	import Calculator from "./modules/Calculator.svelte";
	import ShowHideModules from "./modules/ShowHideModules.svelte";

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
		<ShowHideModules />
		<div id="grid">
			<div style="display: {showCodeEditor ? 'block' : 'none'}"> <!-- CodeEditor doesn't support rerender, we need to just hide it -->
				<CodeEditor />
			</div>
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
</main>
