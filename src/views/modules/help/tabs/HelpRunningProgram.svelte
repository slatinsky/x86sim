<script>
    import {_} from "svelte-i18n";
	import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>Máme program v editore kódu, ale samotnému programu nerozumieme. Ako to vyriešime? Odsledujeme vykonávanie programu po krokoch, na ktoré použijeme rôzne ovládacie prvky z navigačnej lišty</p>
	<img src="assets/help/running_program/tutorial_left_navigation.png" alt="" class="img-fluid d-block mx-auto mb-5">

	<b>Rýchly prehľad:</b><br>
{:else}
	<p>We have a program in the code editor, but we don't understand it. How do we solve this? We follow the execution of the program step by step, which we use various control elements from the navigation bar</p>
	<img src="assets/help/running_program/tutorial_left_navigation.png" alt="" class="img-fluid d-block mx-auto mb-5">

	<b>Quick overview:</b><br>
{/if}

<table class="table">
    <thead>
    <tr>
		{#if $language === 'sk'}
			<th scope="col">Názov tlačidla</th>
			<th scope="col">Popis</th>
		{:else}
			<th scope="col">Button name</th>
			<th scope="col">Description</th>
		{/if}
    </tr>
    </thead>
    <tbody>
    <tr>
        <th>{$_('views.navigation.step')}</th>
        <td>{$_('tooltips.navigation.step')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.stepBack')}</th>
        <td>{$_('tooltips.navigation.stepBack')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.run')}</th>
        <td>{$_('tooltips.navigation.run')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.runBackwards')}</th>
        <td>{$_('tooltips.navigation.runBackwards')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.pause')}</th>
        <td>{$_('tooltips.navigation.pause')}</td>
    </tr>
    <tr>
        <th>{$_('views.navigation.reset')}</th>
        <td>{$_('tooltips.navigation.reset')}</td>
    </tr>
    </tbody>
</table>
<hr>
{#if $language === 'sk'}
	<p>Stlačením tlačidla "Krok" je vykonaná inštrukcia, na ktorú ukazuje IP register. Inštrukcia, ktorá sa vykoná ako ďalšia je vyznačená v editore kódu zelenou farbou</p>
	<img src="assets/help/running_program/step.png" alt="" class="img-fluid d-block mx-auto">
	<div class="alert alert-danger mt-5" role="alert">
		<b>Počas krokovania programu nie ukladané vaše zmeny v projekte</b>: Pred vypnutím simulátora sa uistite, že ste vypli krokovací režim (stlačením tlačidla "Zresetovať"), inak môžete stratiť svoje zmeny
		<img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">

		<p class="mt-3">Ak aj napriek tomu sa pokúsite vypnúť simulátor s neuloženými zmenami, simulátor vás na neuložené zmeny upozorní:</p>
		<img src="assets/help/running_program/unsaved_changes.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<hr>
	<p>Stlačením tlačidla "Krok späť" sa vrátite v histórií o jednu vykonanú inštrukciu</p>
	<img src="assets/help/running_program/stepBack.png" alt="" class="img-fluid d-block mx-auto">
	<hr>
	<p>Tlačidlo "Spustiť" automaticky spúšťa "Krok" až pokým stlačíte tlačidlo "Pozastaviť" (alebo do ukončenia programu)</p>
	<img src="assets/help/running_program/run.png" alt="" class="img-fluid d-block mx-auto">

	<div class="alert alert-success mt-5" role="alert">
		<b>Tip:</b>
		Ak potrebujete automaticky pozastaviť vykonávanie programu v konkrétnej časti, môžete si v editore kódu vytvoriť breakpoint. Breakpoint vytvoríte (aj zrušíte) kliknutím vľavo vedľa adresy v editore kódu.
		<br><br>
		<img src="assets/help/running_program/breakpoint.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<hr>
	<p>Tlačidlo "Pretočiť naspäť" automaticky spúšťa "Krok naspäť" až pokým stlačíte tlačidlo "Pozastaviť" (alebo do začiatku programu)</p>
	<img src="assets/help/running_program/runBack.png" alt="" class="img-fluid d-block mx-auto">

	<hr>
	<p>Tlačidlo "Zresetovať" vráti stav simulátora na stav pred spustením krokovania</p>
{:else}
	<p>By pressing the "Step" button, the instruction pointed to by the IP register is executed. The instruction that will be executed next is marked in the code editor in green</p>
	<img src="assets/help/running_program/step.png" alt="" class="img-fluid d-block mx-auto">
	<div class="alert alert-danger mt-5" role="alert">
		<b>During program execution, your changes are not saved</b>: Before turning off the simulator, make sure you have turned off the step-by-step mode (by pressing the "Reset" button), otherwise you may lose your changes
		<img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">

		<p class="mt-3">If you try to turn off the simulator with unsaved changes, the simulator will warn you about unsaved changes:</p>
		<img src="assets/help/running_program/unsaved_changes.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<hr>
	<p>By pressing the "Step back" button, you return in the history one executed instruction</p>
	<img src="assets/help/running_program/stepBack.png" alt="" class="img-fluid d-block mx-auto">
	<hr>
	<p>The "Run" button automatically starts "Step" until you press the "Pause" button (or until the end of the program)</p>
	<img src="assets/help/running_program/run.png" alt="" class="img-fluid d-block mx-auto">

	<div class="alert alert-success mt-5" role="alert">
		<b>Tip:</b>
		If you need to automatically pause the execution of the program in a specific part, you can create a breakpoint in the code editor. You can create (and remove) a breakpoint by clicking on the left next to the address in the code editor.
		<br><br>
		<img src="assets/help/running_program/breakpoint.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<hr>
	<p>The "Run backwards" button automatically starts "Step back" until you press the "Pause" button (or until the beginning of the program)</p>
	<img src="assets/help/running_program/runBack.png" alt="" class="img-fluid d-block mx-auto">

	<hr>
	<p>The "Reset" button returns the simulator state to the state before the start of the step-by-step mode</p>
{/if}
