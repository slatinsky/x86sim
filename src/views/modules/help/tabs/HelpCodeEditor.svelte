<script>
    import {language} from "../../../../stores/language";
</script>

{#if $language === 'sk'}
	<p>V editore kódu píšete zdrojový kód v jazyku symbolických inštrukcií</p>
	<img src="assets/help/code_editor/code_editor.png" alt="" class="img-fluid d-block mx-auto"><br><br>

	<h4 class="mt-5">Užitočné skratky</h4>
	<table class="table">
		<thead>
		<tr>
			<th scope="col">Skratka</th>
			<th scope="col">Popis</th>
		</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">CTRL+C</th>
				<td>Skopírovanie do schránky</td>
			</tr>
			<tr>
				<th scope="row">CTRL+V</th>
				<td>Vloženie zo schránky</td>
			</tr>
			<tr>
				<th scope="row">CTRL+D</th>
				<td>Vymazanie riadka</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SHIFT+D</th>
				<td>Zduplikovanie riadka</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SPACE</th>
				<td>Vyvolanie autocomplete</td>
			</tr>
			<tr>
				<th scope="row">ALT+šípka hore (alebo dole)</th>
				<td>Výmena susedných riadkov</td>
			</tr>
			<tr>
				<th scope="row">CTRL+šípka doľava (alebo doprava)</th>
				<td>Kurzor preskakuje slová</td>
			</tr>
			<tr>
				<th scope="row">SHIFT+šípka doľava (alebo doprava)</th>
				<td>Označovanie textu</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SHIFT+šípka doľava (alebo doprava)</th>
				<td>Označovanie textu po slovách</td>
			</tr>
		</tbody>
	</table>

	<p>Ďalšie skratky nájdete na <a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" target="_blank">tomto odkaze</a>. Niektoré skratky nie sú podporované.</p>
	<hr>
	<p>Inštrukcia, ktorá sa vykoná ako ďalšia je vyznačená v editore kódu zelenou farbou (podľa IP registra)</p>
	<img src="assets/help/running_program/step.png" alt="" class="img-fluid d-block mx-auto">
	<hr>

	<p>V editore kliknutím na bočný panel vedľa adries nastavujete/rušíte breakpointy, na ktorých sa program počas spusteného programu pozastaví</p>
	<img src="assets/help/running_program/breakpoint.png" alt=""><br><br>
{:else}
	<p>In the code editor you write the source code in the symbolic instruction language</p>
	<img src="assets/help/code_editor/code_editor.png" alt="" class="img-fluid d-block mx-auto"><br><br>

	<h4 class="mt-5">Useful shortcuts</h4>
	<table class="table">
		<thead>
		<tr>
			<th scope="col">Shortcut</th>
			<th scope="col">Description</th>
		</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">CTRL+C</th>
				<td>Copy to clipboard</td>
			</tr>
			<tr>
				<th scope="row">CTRL+V</th>
				<td>Paste from clipboard</td>
			</tr>
			<tr>
				<th scope="row">CTRL+D</th>
				<td>Delete line</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SHIFT+D</th>
				<td>Duplicate line</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SPACE</th>
				<td>Invoke autocomplete</td>
			</tr>
			<tr>
				<th scope="row">ALT+arrow up (or down)</th>
				<td>Swap adjacent lines</td>
			</tr>
			<tr>
				<th scope="row">CTRL+arrow left (or right)</th>
				<td>Cursor skips words</td>
			</tr>
			<tr>
				<th scope="row">SHIFT+arrow left (or right)</th>
				<td>Select text</td>
			</tr>
			<tr>
				<th scope="row">CTRL+SHIFT+arrow left (or right)</th>
				<td>Select text by words</td>
			</tr>
		</tbody>
	</table>

	<p>You can find more shortcuts on <a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" target="_blank">this link</a>. Some shortcuts are not supported.</p>
	<hr>
	<p>The instruction that will be executed next is highlighted in the code editor in green (according to the IP register)</p>
	<img src="assets/help/running_program/step.png" alt="" class="img-fluid d-block mx-auto">
	<hr>

	<p>In the code editor, by clicking on the side panel next to the addresses, you set / unset breakpoints where the program will pause during the running program</p>
	<img src="assets/help/running_program/breakpoint.png" alt=""><br><br>
{/if}

