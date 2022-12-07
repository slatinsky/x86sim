<script>
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<img src="assets/help/memory/memory.png" alt="" class="img-fluid d-block mx-auto">

	<p>Editor pamäte vám dovoľuje editovať obsah operačnej pamäte</p>

	<h4 class="mt-5">Ako editovať hodnotu v pamäti</h4>
	<p>Pre editáciu hodnoty kliknite na hodnotu, ktorú chcete zmeniť. V pravom dolnom rohu okna simulátora sa vám zobrazí informácia, že editujete danú bunku</p>
	<img src="assets/help/memory/memory_editing.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">A taktiež je editovaná hodnota označená kurzorom (šedá farba)</div>

	<img src="assets/help/memory/selected.png" alt="" class="img-fluid d-block mx-auto">

	<p>Zadajte na klávesnici hodnotu v šestnástkovej sústave od 00 do FF. Po zadaní hodnoty sa kurzor automaticky posunie na ďalšiu adresu</p>

	<p>Pre ukončenie editovania kliknite mimo modulu editora alebo stlačte klávesu <b>ESC</b></p>


	<h4 class="mt-5">Ďalšie klávesové skratky</h4>
	<p>Pre presun kurzora je možné použiť <b>šípky</b> na klávesnici</p>

	<p>Pre vynulovanie práve editovanej adresy stlačte klávesu <b>DELETE</b> na klávesnici</p>

	<div class="alert alert-danger" role="alert">
		Počas krokovacieho režimu nie je ukladaný obsah pamäte. Ak zmeníte obsah pamäte počas krokovania, vaše zmeny budú vrátené na pôvodný stav ukončením krokovacieho režimu (stlačením tlačidla "Zresetovať")<br>
		<img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<h4 class="mt-5">Rýchle nájdenie adresy</h4>
	<p>1 MB hlavnej pamäte je dosť rozsiahla oblasť - preto ak poznáte adresu pamäte, viete na túto adresu priamo skočiť pomocou "Skočiť na offset". Napríklad na oblasť pamäte namapovanú na obrazovku skočíme takto:</p>
	<img src="assets/help/memory/jump_to_offset.png" alt="" class="img-fluid d-block mx-auto">
{:else}
	<img src="assets/help/memory/memory.png" alt="" class="img-fluid d-block mx-auto">

	<p>The memory editor allows you to edit the contents of the operating memory</p>

	<h4 class="mt-5">How to edit a value in memory</h4>
	<p>To edit a value, click on the value you want to change. In the lower right corner of the simulator window, you will see information that you are editing the given cell</p>
	<img src="assets/help/memory/memory_editing.png" alt="" class="img-fluid d-block mx-auto">

	<div class="mt-3">And the edited value is also highlighted with a cursor (gray color)</div>

	<img src="assets/help/memory/selected.png" alt="" class="img-fluid d-block mx-auto">

	<p>Enter the value on the keyboard in hexadecimal system from 00 to FF. After entering the value, the cursor will automatically move to the next address</p>

	<p>To end editing, click outside the editor module or press the <b>ESC</b> key</p>


	<h4 class="mt-5">Other keyboard shortcuts</h4>
	<p>To move the cursor, you can use the <b>arrows</b> on the keyboard</p>

	<p>To reset the currently edited address, press the <b>DELETE</b> key on the keyboard</p>

	<div class="alert alert-danger" role="alert">
		During the step-by-step mode, the memory content is not saved. If you change the memory content during the step-by-step mode, your changes will be returned to the original state when the step-by-step mode is ended (by pressing the "Reset" button)<br>
		<img src="assets/help/running_program/reset.png" alt="" class="img-fluid d-block mx-auto">
	</div>

	<h4 class="mt-5">Quick search for an address</h4>
	<p>1 MB of main memory is quite a large area - so if you know the memory address, you can jump directly to that address using "Jump to offset". For example, to jump to the memory area mapped to the screen:</p>
	<img src="assets/help/memory/jump_to_offset.png" alt="" class="img-fluid d-block mx-auto">
{/if}