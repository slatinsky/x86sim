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
	import ChooseLanguage from "./modules/ChooseLanguage.svelte";
	import {_} from "svelte-i18n";
	import {language} from "@stores/language";
	import ShowHideModules from "./modules/ShowHideModules.svelte";
	import {query_selector_all} from "svelte/internal";
	import {onMount} from "svelte";


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
			toastQueue.success($_('tooltips.autosave'))
		}
	}, false);


	$: if ($debugMode) {
		// ask user if they want to leave the page with unsaved changes. (project is not saved in debugging mode)
		// this message is not shown to users in modern browsers -  https://stackoverflow.com/a/37782307/14409632
		window.onbeforeunload = () => `you are currently using debugging mode and you have have unsaved changes. Press 'Reset' button to save your changes`
	} else {
		window.onbeforeunload = null;
	}

	$: stackOrMemoryCount = $settings.shownModules.showStack + $settings.shownModules.showMemory
	$: middleModulesCount = $settings.shownModules.showCalculator + $settings.shownModules.showRegisters + $settings.shownModules.showScreen + $settings.shownModules.showKeyboard

	/* START - Set stack and memory container size using Javascript. I didn't find a way to do it using CSS */
	function setStackMemoryHeight(mddlCount, smCount) {
		try {
			if (mounted && document.querySelector('#areaStackMemory')) {
				if (smCount > 0) {
					if (0 < mddlCount && mddlCount < 2) {
						let height = window.innerHeight - document.querySelector('nav').getBoundingClientRect().height
						let children = document.getElementById('areaMiddleModules').childNodes;
						for(let child of children){
							if(child instanceof Element) {
								height -= child.getBoundingClientRect().height
							}
						}
						height -= 300  // magic value
						document.querySelector('#areaStackMemory').setAttribute("style",`height:${Math.max(height, 0)}px`);
					}
					else {
						document.querySelector('#areaStackMemory').setAttribute("style",`height:calc(100% - ${document.querySelector('nav').getBoundingClientRect().height}px)`);
					}
				}
				else {
					document.querySelector('#areaStackMemory').setAttribute("style",`height:0`);
				}
			}
		}
		catch (e) {
			console.error("setStackMemoryHeight - should be fixed error", e)  // this error should be fixed, but just in case log it. Else it will take down entire simulator
		}
	}

	let mounted = false
	onMount(() => {
		mounted = true
		window.addEventListener('resize', function(event) {
			setTimeout(()=>setStackMemoryHeight(middleModulesCount, stackOrMemoryCount), 100)
		}, true)

		window.addEventListener('load', function(event) {
			setTimeout(()=>setStackMemoryHeight(middleModulesCount, stackOrMemoryCount), 100)
		}, true)

		setInterval(()=> {  // doesn't work without polling after another project load
			setStackMemoryHeight(middleModulesCount, stackOrMemoryCount)
		}, 1000)
	})
	$: setStackMemoryHeight(middleModulesCount, stackOrMemoryCount)
	/* END - Set stack and memory container size using Javascript */
</script>

<style>
	#grid {
		display: grid;
		grid-gap: 15px;
		grid-template-areas:
            "areaCodeEditor areaMiddleModules areaStackMemory";
	}

	#grid.stackMemory-count-0 {
		grid-template-areas:
            "areaCodeEditor areaMiddleModules";
	}


	#grid.middle-count-0,
	#grid.middle-count-1{
		grid-template-areas:
            "areaCodeEditor areaMiddleModules"
            "areaCodeEditor areaStackMemory";
	}


	#grid.stackMemory-count-0.middle-count-0 {
		grid-template-areas:
            "areaCodeEditor";
	}

	@media (min-width: 1000px) {

	}

	#areaCodeEditor {
		grid-area: areaCodeEditor;
		min-width: 350px;
		width: 100%;
		max-width: 100vw;
	}

	#areaMiddleModules {
		grid-area: areaMiddleModules;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
	}

	#areaStackMemory {
		grid-area: areaStackMemory;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

</style>


<main>
	{#if $language === null}
		<ChooseLanguage />
	{:else}
		<Spinner />
		<Navigation />
<!--		debug module -->
<!--		<ShowHideModules />-->

		<div class="container-fluid">
			<div id="grid" class="middle-count-{middleModulesCount} stackMemory-count-{stackOrMemoryCount}">
				{#if $settings.shownModules.showCodeEditor}
					<div id="areaCodeEditor">
						<CodeEditor />
					</div>
				{/if}
				{#if middleModulesCount > 0}
					<div id="areaMiddleModules">
						{#if $settings.shownModules.showCalculator}
							<div style="grid-area: areaCalculator; padding-bottom: 15px;">
								<Calculator />
							</div>
						{/if}
						{#if $settings.shownModules.showRegisters}
							<div style="grid-area: areaRegisters; padding-bottom: 15px;">
								<Registers />
							</div>
						{/if}
						{#if $settings.shownModules.showScreen}
							<div style="grid-area: areaScreen; padding-bottom: 15px;">
								<Screen />
							</div>
						{/if}
						{#if $settings.shownModules.showKeyboard}
							<div style="grid-area: areaKeyboard">
								<Keyboard />
							</div>
						{/if}
					</div>
				{/if}
				{#if stackOrMemoryCount > 0}
					<div id="areaStackMemory">
						{#if $settings.shownModules.showStack}
							<div style="padding-right: 15px;">
								<VirtualStack />
							</div>
						{/if}
						{#if $settings.shownModules.showMemory}
							<div>
								<VirtualMemory />
							</div>
						{/if}
					</div>
				{/if}
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
	{/if}
</main>
