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

	import Navigation from "./modules/Navigation.svelte"
	import Registers from "./modules/Registers.svelte";
	import Screen from "./modules/Screen.svelte";
	import Tooltip from "./global/Tooltip.svelte";
	import CodeEditor from "./modules/codeEditor/CodeEditor.svelte";
	import Stack from "./modules/Stack.svelte";
	import LoadSave from "./modules/loadSave/LoadSave.svelte";
	import Modal from "./components/Modal.svelte";

	import {appState} from "../stores/appState";
	import {settings} from "../stores/settings";
	import Settings from "./modules/Settings.svelte";
	import Spinner from "./modules/Spinner.svelte";
	import Memory from "./modules/Memory.svelte";

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
        grid-template-columns: 300px auto auto auto;
		gap: 15px
	}

	@media (min-width: 992px) {
		#grid {
			grid-template-columns: 450px auto auto auto;
		}
	}
</style>


<main>
	<Spinner />
	<Navigation />

	<div class="container-fluid">
		<div id="grid">
			<CodeEditor />
			<div>
				<Registers />
				<Stack />
			</div>
			<div>
				<Screen />
			</div>
			<div>
				<Memory />
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

<Tooltip />
