<script>
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>Simulátor obsahuje nasledujúce moduly:</p>
	<ul>
		<li>Editor kódu</li>
		<li>Editor registrov</li>
		<li>Editor hlavnej pamäte</li>
		<li>Editor zásobníka (iný pohľad na hlavnú pamäť)</li>
		<li>Textové výstupné zariadenie (obrazovka)</li>
		<li>Vstupné zariadenie (klávesnica)</li>
		<li>Kalkulačku</li>
	</ul>

	<div class="alert alert-success mt-5" role="alert">
		<b>Tip:</b>
		Ak niektoré z modulov nepoužívate, je možné ich skryť v projektových nastaveniach. Viac info v pomocníkovi "Nastavenia"
		<br><br>
		<img src="assets/help/settings/project_settings.png" alt="" class="img-fluid d-block mx-auto mb-5">
	</div>
{:else}
	<p>Simulator contains following modules:</p>
	<ul>
		<li>Code editor</li>
		<li>Register editor</li>
		<li>Main memory editor</li>
		<li>Stack editor (different view of main memory)</li>
		<li>Text output device (screen)</li>
		<li>Input device (keyboard)</li>
		<li>Calculator</li>
	</ul>

	<div class="alert alert-success mt-5" role="alert">
		<b>Tip:</b>
		If you don't use some of the modules, you can hide them in project settings. More info in "Settings" manual
		<br><br>
		<img src="assets/help/settings/project_settings.png" alt="" class="img-fluid d-block mx-auto mb-5">
	</div>
{/if}