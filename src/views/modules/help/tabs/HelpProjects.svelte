<script>
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>K projektom sa dostanete z navigačnej lišty stlačením tlačidla "Projekty":</p>

	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<p class="mt-5">Na tejto obrazovke spravujete svoje projekty.</p>

	<div class="alert alert-success" role="alert">
		Všetky zmeny v simulátore sú automaticky ukladané v lokálnom úložisku prehliadača - nie je potrebné projekt manuálne ukladať.
	</div>

	<p>Na obrazovke projektov viete vykonávať nasledujúce činnosti:</p>
	<ul>
		<li>Vytvoriť nový projekt</li>
		<li>Vymazať projekt</li>
		<li>Premenovať projekt</li>
		<li>Stiahnuť projekt (v JSON formáte)</li>
		<li>Stiahnuť všetky projekty (ZIP súbor obsahujúci samostatné projekty v JSON formáte)</li>
	</ul>

	<img src="assets/help/projects/projects.png" alt="" class="img-fluid w-50 d-block mx-auto">

	<h4 class="mt-5">Vysvetlenie jednotlivých častí</h4>



	<div class="mt-3">Aktuálne otvorený projekt je vyznačený šedou farbou.</div>
	<img src="assets/help/projects/opened_project.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Ostatné projekty majú biele pozadie. Pre prepnutie sa do iného projektu kliknite na názov projektu:</div>
	<img src="assets/help/projects/available_project.png" alt="" class="img-fluid d-block mx-auto">


	<div class="mt-3">Tlačidlom "vymazať" odstránite projekt:</div>
	<img src="assets/help/projects/delete.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Tlačidlom "premenovať" zmeníte pomenovanie projektu:</div>
	<img src="assets/help/projects/rename.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Tlačidlom "stiahnuť" stiahnete projekt. Projekt bude uložený ako JSON súbor, ktorý môžete neskôr importovať naspäť do simulátora alebo zdieľať s inou osobou:</div>
	<img src="assets/help/projects/download.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Ak si prajete stiahnuť všetky projekty v ZIP archíve, použite tlačidlo "Stiahnuť všetky projekty". Vhodné ako záloha vašej práce:</div>
	<img src="assets/help/projects/download_all.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Stiahnuté projekty je možné naspäť importovať do simulátora ich pretiahnutím do okna simulátora:</div>
	<img src="assets/help/projects/drag_and_drop.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Tlačidlom "Vytvoriť nový projekt" a jeho následným pomenovaním vytvoríte nový projekt. Po jeho vytvorení je potrebné ho otvoriť kliknutím na neho:</div>
	<img src="assets/help/projects/create_new_project.png" alt="" class="img-fluid d-block mx-auto">
{:else}
	<p>You can access projects from the navigation bar by pressing the "Projects" button:</p>

	<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

	<p class="mt-5">On this screen you manage your projects.</p>

	<div class="alert alert-success" role="alert">
		All changes in the simulator are automatically saved in the browser's local storage - you do not need to manually save the project.
	</div>

	<p>You can perform the following actions on the projects screen:</p>
	<ul>
		<li>Create a new project</li>
		<li>Delete a project</li>
		<li>Rename a project</li>
		<li>Download a project (in JSON format)</li>
		<li>Download all projects (ZIP file containing separate projects in JSON format)</li>
	</ul>

	<img src="assets/help/projects/projects.png" alt="" class="img-fluid w-50 d-block mx-auto">

	<h4 class="mt-5">Explanation of individual parts</h4>



	<div class="mt-3">The currently opened project is highlighted in gray.</div>
	<img src="assets/help/projects/opened_project.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Other projects have a white background. To switch to another project, click on the project name:</div>
	<img src="assets/help/projects/available_project.png" alt="" class="img-fluid d-block mx-auto">


	<div class="mt-3">The "delete" button removes the project:</div>
	<img src="assets/help/projects/delete.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">The "rename" button changes the name of the project:</div>
	<img src="assets/help/projects/rename.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">The "download" button downloads the project. The project will be saved as a JSON file that you can later import back into the simulator or share with another person:</div>
	<img src="assets/help/projects/download.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">If you want to download all projects in a ZIP archive, use the "Download all projects" button. Useful as a backup of your work:</div>
	<img src="assets/help/projects/download_all.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">Downloaded projects can be imported back into the simulator by dragging them into the simulator window:</div>
	<img src="assets/help/projects/drag_and_drop.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">The "Create new project" button and its subsequent naming create a new project. After its creation, it must be opened by clicking on it:</div>
	<img src="assets/help/projects/create_new_project.png" alt="" class="img-fluid d-block mx-auto">




{/if}