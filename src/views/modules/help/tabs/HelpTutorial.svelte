<script>
    import {defaultProjectsName} from "../../../../defaults/defaultProjects";
    import {programs, projectName} from "../../../../stores";
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>Aby ste sa s programovaním v jazyku symbolických inštrukcií zoznámili, simulátor obsahuje krátke tutoriálové projekty, v ktorých nájdete základné informácie, ako začať</p>

	{#if !$projectName.includes('tutorial')}
		<div class="alert alert-danger" role="alert">
			Aktuálne nie ste prepnutý do tutoriálového projektu. Pre začiatok tutoriálu môžete začať napríklad v projekte <a href="#" on:click={()=>programs.loadProject(defaultProjectsName)}>{defaultProjectsName}</a>
		</div>
	{/if}

	<p>Pre prepnutie sa do tutoriálu je potrebné si otvoriť tutoriálový projekt. V hornej navigačnej lište nájdite tlačidlo projekty:</p>
	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<p>A kliknite na prvý projekt začínajúci slovom "tutorial" pre jeho otvorenie</p>
	<img src="assets/help/projects/opened_project.png" alt="" class="img-fluid d-block mx-auto"><br><br>

	<p>Komentáre v editore kódu vás na začiatku naučia pracovať so simulátorom, neskôr vám ukážu základné konštrukcie v jazyku symbolických inštrukcií</p>
	<img src="assets/help/tutorial/tutorial_code_editor.png" alt="" class="img-fluid d-block mx-auto">

	<p>Ukážkový program si spúšťajte po jednej inštrukcii stláčaním tlačidla "Krok"</p>
	<img src="assets/help/running_program/step_hover.png" alt="" class="img-fluid d-block mx-auto">

	<!--<p>Ak v nejakej časti budete stratení, odporúčam sa vrátiť k tomuto pomocníkovi</p>-->
	<!--<img src="assets/help/manual_button.png" alt="" class="img-fluid d-block mx-auto">-->

	<p>Po pozretí tutoriálového projektu sa prepnite na ďalší projekt a zopakujte tieto pokyny</p>
	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<div class="alert alert-info mt-5" role="alert">
		<b>INFO: </b>Tutoriál vám postupne bude odkrývať jednotlivé moduly simulátora. Nezľaknite sa, ak sa niečo nové objaví na obrazovke :)<br>
		<img src="assets/help/tutorial/hidden_modules_in_tutorial.png" alt="" class="img-fluid d-block mx-auto">
	</div>
{:else}
	<p>To get familiar with the programming language of symbolic instructions, the simulator contains short tutorial projects, in which you will find basic information on how to start</p>

	{#if !$projectName.includes('tutorial')}
		<div class="alert alert-danger" role="alert">
			You are not currently switched to the tutorial project. To start the tutorial, you can start for example in the project <a href="#" on:click={()=>programs.loadProject(defaultProjectsName)}>{defaultProjectsName}</a>
		</div>
	{/if}

	<p>To switch to the tutorial, you need to open the tutorial project. In the top navigation bar, find the projects button:</p>
	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<p>And click on the first project starting with the word "tutorial" to open it</p>
	<img src="assets/help/projects/opened_project.png" alt="" class="img-fluid d-block mx-auto"><br><br>

	<p>Comments in the code editor will teach you how to work with the simulator at the beginning, later they will show you the basic constructions in the language of symbolic instructions</p>
	<img src="assets/help/tutorial/tutorial_code_editor.png" alt="" class="img-fluid d-block mx-auto">

	<p>Run the sample program one instruction at a time by pressing the "Step" button</p>
	<img src="assets/help/running_program/step_hover.png" alt="" class="img-fluid d-block mx-auto">

	<!--<p>If you are lost in some part, I recommend you to return to this help</p>-->
	<!--<img src="assets/help/manual_button.png" alt="" class="img-fluid d-block mx-auto">-->

	<p>After watching the tutorial project, switch to the next project and repeat these instructions</p>
	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<div class="alert alert-info mt-5" role="alert">
		<b>INFO: </b>The tutorial will gradually reveal the individual modules of the simulator. Do not be afraid if something new appears on the screen :)<br>
		<img src="assets/help/tutorial/hidden_modules_in_tutorial.png" alt="" class="img-fluid d-block mx-auto">
	</div>
{/if}
