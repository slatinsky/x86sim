<script>
	import Navigation from "./Navigation.svelte"
	import Photos from "./Photos.svelte";
	import Registers from "./modules/Registers.svelte";
	import Screen from "./modules/Screen.svelte";
	import Tooltip from "./global/Tooltip.svelte";
	import CodeEditor from "./modules/CodeEditor.svelte";
	import Stack from "./modules/Stack.svelte";
	import LoadSave from "./LoadSave.svelte";

	export let name
	let count = 1
	$: src = `https://dodomceka.sk/foto/1572/titulna/1572-${count}.jpg?v=1607944588`

	$: console.log('zmeneny count na', count)

	function handleClick() {
		count++
	}
</script>

<style>
	:global(body) {
		margin: 0 !important;
		padding: 0 !important;
	}

	/*main {*/
	/*	text-align: center;*/
	/*	padding: 1em;*/
	/*	max-width: 240px;*/
	/*	margin: 0 auto;*/
	/*}*/

	/*h1 {*/
	/*	color: #ff3e00;*/
	/*	text-transform: uppercase;*/
	/*	font-size: 4em;*/
	/*	font-weight: 100;*/
	/*}*/

	/*@media (min-width: 640px) {*/
	/*	main {*/
	/*		max-width: none;*/
	/*	}*/
	/*}*/

	/*img	{*/
	/*	width: 100%;*/
	/*}*/
</style>

<svelte:head>
<!--	Bootstrap 5 -->
<!--	https://getbootstrap.com/-->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">

<!--	fontawesome 5-->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA==" crossorigin="anonymous" />
</svelte:head>

<main>
	<Navigation />

	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<LoadSave />
			</div>
			<div class="col-6">
				<Registers />
			</div>
			<div class="col-6">
				<Stack />
			</div>
			<div class="col-6">
				<Screen />
			</div>

			<div class="col-6">
				<CodeEditor />
			</div>
		</div>


	</div>

<!--	<Photos />-->
<!--	<h2>Helllo {name.toUpperCase()}!</h2>-->
<!--	<h3>count {count}!</h3>-->
<!--	<img {src} alt="">-->
<!--	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>-->
<!--	<button on:click={handleClick}>Ďalšia fotka</button>-->
</main>

<Tooltip />
