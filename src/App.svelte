<svelte:head>
	<!--	Bootstrap 5 -->
	<!--	https://getbootstrap.com/-->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">

	<!--	fontawesome 5-->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />
</svelte:head>

<script lang="ts">
	// clear the loader
	document.body.innerHTML = '';

	import Navigation from "./Navigation.svelte"
	import Registers from "./modules/Registers.svelte";
	import Screen from "./modules/Screen.svelte";
	import Tooltip from "./global/Tooltip.svelte";
	import CodeEditor from "./modules/codeEditor/CodeEditor.svelte";
	import Stack from "./modules/Stack.svelte";
	import LoadSave from "./store/LoadSave.svelte";
	import Modal from "./components/Modal.svelte";

	import {settingsShown, projectsShown} from "./store/store.js"
	import Settings from "./modules/Settings.svelte";
</script>

<style>
	:global(body) {
		margin: 0 !important;
		padding: 0 !important;
	}

	/*@media (min-width: 640px) {*/

	/*}*/
</style>


<main>
	<Navigation />
	<div class="container-fluid">
		<div class="row">
			<div class="col-3">
				<CodeEditor />
			</div>
			<div class="col-9">
				<div class="row">
					<div class="col-6">
						<Registers />
					</div>
					<div class="col-6">
						<Stack />
					</div>
					<div class="col-6">
						<Screen />
					</div>
				</div>
			</div>
		</div>
	</div>

	<Modal bind:shown={$settingsShown}>
		<Settings />
	</Modal>

	<Modal bind:shown={$projectsShown}>
		<LoadSave />
	</Modal>
</main>

<Tooltip />
