<script>
	import { MAX_EXECUTED_INSTRUCTION_COUNT } from "../../../../stores/config";
	import { language } from "../../../../stores/language";
</script>

{#if $language === "sk"}
	<p>
		V nastaveniach je možné nakonfigurovať rôzne nastavenia projektu aj
		simulátora
	</p>

	<p>
		K nastaveniam sa dostanete cez navigačnú lištu - kliknutím na tlačidlo
		"Nastavenia"
	</p>
	<img
		src="assets/help/settings/placement.png"
		alt=""
		class="img-fluid d-block mx-auto"
	/>

	<p>Nastavenia sú rozdelené do troch skupín:</p>
	<ul>
		<li>Globálne nastavenia</li>
		<li>Nastavenia špecifické pre konkrétny projekt</li>
		<li>Možnosť zresetovania simulátora</li>
	</ul>

	<h4 class="mt-5">Globálne nastavenia</h4>
	<p>
		Globálne nastavenia sa aplikujú v celom simulátore. Nezáleží na tom, aký
		projekt máte aktuálne spustený
	</p>
	<h5 class="mt-3">Tmavá téma</h5>
	<p>Simulátor podporuje tmavú tému</p>
	<img
		src="assets/help/settings/checkbox_dark_theme.png"
		alt=""
		class="img-fluid d-block mx-auto mb-1"
	/>
	<img
		src="assets/help/settings/light_dark_theme.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>

	<h5 class="mt-3">Aktivovanie histórie vykonania inštrukcií</h5>
	<p>Zapnutím tejto možnosti:</p>
	<ul>
		<li>
			Simulátor nebude používať veľké množstvo pamäte RAM pre dlhšie
			bežiace programy
		</li>
		<li>Programy teoreticky budú môcť bežať nekonečne dlho</li>
		<li>
			V kombinácií s vypnutými animáciami bude vykonanie inštrukcií veľmi
			rýchle, až "instantné"
		</li>
	</ul>
	<p>Deaktivovaním histórie sa vypne nasledovná funkcionalita:</p>
	<ul>
		<li>
			Nebudete môcť sa vrátiť vo vykonaní programu po krokoch späť
			(tlačidlá "Krok späť" a "Pretočiť naspäť"), ale bude možné simulátor
			vrátiť do stavu pred zapnutím krokovacieho režimu stlačením tlačidla
			"Reset"
		</li>
		<li>
			Simulátor nebude zobrazovať červenou farbou zmenené hodnoty v
			registroch a pamäti
		</li>
	</ul>

	<h5 class="mt-3">Sledovať IP register v editore kódu</h5>
	<p>
		IP register vždy ukazuje na adresu inštrukcie, ktorá sa vykoná ako
		ďalšia. Zapnutím tejto možnosti pri krokovaní editor kódu automaticky
		posunie obrazovku tak, aby bola ďalšia vykonávaná inštrukcia vždy
		viditeľná
	</p>

	<h5 class="mt-3">Rýchlosť / vypnutie animácie</h5>
	<p>
		Taktiež je možné nastaviť, ako rýchlo funkcia "Spustiť" spúšťa
		inštrukcie (animácia). Ak vypnete túto animáciu, inštrukcie sa vykonajú
		instantne
	</p>

	<div class="alert alert-success" role="alert">
		<b>TIP:</b> NOP inštrukcia ignoruje vypnutie animácie. Užitočné, ak chcete
		v nejakom mieste kódu počkať, napríklad po vykreslení na obrazovku alebo
		v cykle na načítanie klávesy z klávesnice.
	</div>
	<img
		src="assets/help/settings/animations.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
	<div class="alert alert-info mt-5" role="alert">
		<b>INFO: </b>Simulátor obsahuje ochranu voči nekonečnému cyklu. Ak
		napíšete a spustíte kód s nekonečným cyklom s vypnutou animáciou,
		simulátor vykonávanie kódu automaticky pozastaví, ak sa vykoná viac ako {MAX_EXECUTED_INSTRUCTION_COUNT}
		inštrukcií. Stačí počkať, simulátor "odmrzne" :)
	</div>

	<h4 class="mt-5">Projektové nastavenia</h4>
	<p>Projektové nastavenia sa aplikujú len na práve otvorený projekt</p>

	<p>
		Ak v simulátore nepoužívate niektorý modul, ako napríklad obrazovku a
		klávesnicu, viete si ich jednoducho vypnúť
	</p>
	<img
		src="assets/help/settings/project_settings.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
	<img
		src="assets/help/tutorial/hidden_modules_in_tutorial.png"
		alt=""
		class="img-fluid d-block mx-auto"
	/>

	<h4 class="mt-5">Reset simulátora</h4>
	<h5 class="mt-3">Reset všetkých nastavení</h5>
	<p>
		Ak potrebujete zresetovať obsah lokálneho úložiska simulátora, je to
		možné cez toto nastavenie. Simulátor sa opäť načíta v predvolených
		nastaveniach, obsahujúci tutoriálové projekty
	</p>
	<div class="alert alert-danger" role="alert">
		<b>POZOR: </b>Týmto spôsobom budú vymazané všetky PROJEKTY a nastavenia
		simulátora! Pred zresetovaním simulátora odporúčam si svoje projekty
		stiahnuť do počítača.
	</div>
	<p>Reset simulátora vyzerá takto:</p>
	<img
		src="assets/help/settings/reset_all.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>

	<h5 class="mt-3">Zmazanie všetkých projektov</h5>
	<p>
		Ak potrebujete zmazať len všetky projekty (bez vymazania nastavení a
		obnovenia tutoriálových projektov), v nastaveniach "Reset simulátora" je
		aj takáto možnosť
	</p>
	<p>Reset projektov vyzerá takto:</p>
	<img
		src="assets/help/settings/reset_projects.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
{:else}
	<p>
		You can configure various settings of the project and the simulator in
		the settings
	</p>

	<p>
		You can access the settings via the navigation bar - by clicking on the
		"Settings" button
	</p>
	<img
		src="assets/help/settings/placement.png"
		alt=""
		class="img-fluid d-block mx-auto"
	/>

	<p>Settings are divided into three groups:</p>
	<ul>
		<li>Global settings</li>
		<li>Settings specific to a particular project</li>
		<li>Option to reset the simulator</li>
	</ul>

	<h4 class="mt-5">Global settings</h4>
	<p>
		Global settings are applied throughout the simulator. It does not matter
		which project you currently have running
	</p>
	<h5 class="mt-3">Dark theme</h5>
	<p>The simulator supports dark theme</p>
	<img
		src="assets/help/settings/checkbox_dark_theme.png"
		alt=""
		class="img-fluid d-block mx-auto mb-1"
	/>
	<img
		src="assets/help/settings/light_dark_theme.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>

	<h5 class="mt-3">Activating the history of executed instructions</h5>
	<p>By enabling this option:</p>
	<ul>
		<li>
			The simulator will not use a large amount of RAM memory for longer
			running programs
		</li>
		<li>Programs will theoretically be able to run indefinitely</li>
		<li>
			In combination with disabled animations, the execution of
			instructions will be very fast, almost "instant"
		</li>
	</ul>
	<p>
		By deactivating the history, the following functionality will be
		disabled:
	</p>
	<ul>
		<li>
			You will not be able to return to the execution of the program by
			steps back (buttons "Step back" and "Turn back"), but it will be
			possible to return the simulator to the state before turning on the
			step-by-step mode by pressing the "Reset" button
		</li>
		<li>
			The simulator will not display changed values in registers and
			memory in red
		</li>
	</ul>

	<h5 class="mt-3">Tracking IP register in the code editor</h5>
	<p>
		The IP register always points to the address of the instruction that
		will be executed next. By turning on this option, the code editor will
		automatically scroll so that the next executed instruction is always
		visible
	</p>

	<h5 class="mt-3">Speed / disabling animation</h5>
	<p>
		You can also set how fast the "Run" function runs instructions
		(animation). If you turn off this animation, the instructions will be
		executed instantly
	</p>

	<div class="alert alert-success" role="alert">
		<b>TIP:</b> NOP instruction ignores the animation. Useful if you want to
		wait somewhere in the code, for example after drawing on the screen or in
		a loop to load a key from the keyboard.
	</div>
	<img
		src="assets/help/settings/animations.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
	<div class="alert alert-info mt-5" role="alert">
		<b>INFO: </b>The simulator contains protection against an infinite loop.
		If you write and run code with an infinite loop with animation turned
		off, the simulator will automatically pause the execution of the code if
		more than {MAX_EXECUTED_INSTRUCTION_COUNT} instructions are executed. Just
		wait, the simulator will "thaw" :)
	</div>

	<h4 class="mt-5">Project settings</h4>
	<p>Project settings are applied only to the currently open project</p>

	<p>
		If you do not use any module in the simulator, such as the screen and
		keyboard, you can simply turn them off
	</p>
	<img
		src="assets/help/settings/project_settings.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
	<img
		src="assets/help/tutorial/hidden_modules_in_tutorial.png"
		alt=""
		class="img-fluid d-block mx-auto"
	/>

	<h4 class="mt-5">Resetting the simulator</h4>
	<h5 class="mt-3">Reset all settings</h5>
	<p>
		If you need to reset the content of the simulator's local storage, you
		can do so through this setting. The simulator will reload in the default
		settings, containing tutorial projects
	</p>
	<div class="alert alert-danger" role="alert">
		<b>WARNING: </b>By doing this, all PROJECTS and simulator settings will
		be deleted! Before resetting the simulator, I recommend downloading your
		projects to your computer.
	</div>
	<p>Resetting the simulator looks like this:</p>
	<img
		src="assets/help/settings/reset_all.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>

	<h5 class="mt-3">Deleting all projects</h5>
	<p>
		If you need to delete all projects (without deleting settings and
		restoring tutorial projects), there is also such an option in the "Reset
		simulator" settings
	</p>
	<p>Resetting projects looks like this:</p>
	<img
		src="assets/help/settings/reset_projects.png"
		alt=""
		class="img-fluid d-block mx-auto mb-5"
	/>
{/if}
