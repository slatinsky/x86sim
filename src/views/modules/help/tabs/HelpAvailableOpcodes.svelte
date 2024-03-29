<script>
	import {language} from "../../../../stores/language";
    import {opcodes} from "../../../../stores";
    import {_} from "svelte-i18n";

    let moveInstructions = [
        'mov',
        'push',
        'pop',
        'call',
        'ret',
        'in'
    ]
    let arithmeticInstructions = [
        'add',
        'sub',
        'mul',
        'inc',
        'dec',
        'cmp',
    ]
    let logicInstructions = [
        'and',
        'neg',
        'xor',
        'test'
    ]
    let jumpInstructions = [
        'jmp',
        'je',
        'jz',
        'jne',
        'jnz',
        'jo',
        'jno',
        'jp',
        'jpe',
        'jnp',
        'jpo',
        'js',
        'jns'
    ]

    // other implemented opcodes
    // this way if we implement more instructions, we will never forget to add them to help -> because they are added in automatically
    let otherInstructions = Object.keys(opcodes).sort().filter(instruction => ![...moveInstructions, ...arithmeticInstructions, ...logicInstructions,  ...jumpInstructions].includes(instruction))

	if ($language === 'sk') {
		document.title = 'Dostupné inštrukcie'
	} else {
		document.title = 'Available opcodes'
	}
</script>

<p>Vysvetlenie niektorých dôležitých pojmov na tejto stránke pomocníka:</p>
<table class="table">
    <thead>
    <tr>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.explanation')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.example')}</th>
	</tr>
    </thead>
    <tbody>
		{#if $language === 'sk'}
			<tr>
				<th scope="row">Inštrukcia</th>
				<td>Celý obsah inštrukcie obsahujúci typ inštrukcie a nula až dva operandy</td>
				<td><pre>MOV AX, BX</pre></td>
			</tr>
			<tr>
				<th scope="row">Typ inštrukcie (opcode)</th>
				<td>Názov operácie, ktorá sa má vykonať</td>
				<td><pre>MOV</pre></td>
			</tr>
			<tr>
				<th scope="row">Operand</th>
				<td>"Parametre", ktoré poskytneme inštrukcii</td>
				<td><pre>AX, BX</pre></td>
			</tr>
			<tr>
				<th scope="row">Príznak</th>
				<td>Jeden bit z flag registra. Príznaky sa nastavujú automaticky po vykonaní aritmetickej alebo logickej inštrukcie</td>
				<td><pre>ZF</pre></td>
			</tr>
			<tr>
				<th scope="row">Návestie</th>
				<td>Označenie adresy, na ktorú skokové inštrukcie vedia "skočiť". V čase prekladu je zmenená na číselnú hodnotu</td>
				<td><pre>ukonciCyklus:</pre></td>
			</tr>
		{:else}
			<tr>
				<th scope="row">Instruction</th>
				<td>Full instruction content containing instruction type and zero to two operands</td>
				<td><pre>MOV AX, BX</pre></td>
			</tr>
			<tr>
				<th scope="row">Instruction type (opcode)</th>
				<td>Name of the operation to be performed</td>
				<td><pre>MOV</pre></td>
			</tr>
			<tr>
				<th scope="row">Operand</th>
				<td>"Parameters" that we provide to the instruction</td>
				<td><pre>AX, BX</pre></td>
			</tr>
			<tr>
				<th scope="row">Flag</th>
				<td>One bit from the flag register. Flags are automatically set after arithmetic or logical instruction</td>
				<td><pre>ZF</pre></td>
			</tr>
			<tr>
				<th scope="row">Label</th>
				<td>Label of the address to which jump instructions can "jump". During compilation, it is changed to a numeric value</td>
				<td><pre>endOfLoop:</pre></td>
			</tr>
		{/if}
    </tbody>
</table>

<hr>
{#if $language === 'sk'}
	<p>Podporovaná je obmedzená podmnožina inštrukcií intel procesora x86. V tomto zozname nájdete všetky implementované inštrukcie v simulátore:</p>

	<b>Presunové:</b><br>
	<p>Presunové inštrukcie majú za úlohu presun dát z jedného miesta (napríklad zo všeobecného registra) na iné miesto.</p>
{:else}
	<p>Supported is a limited subset of intel x86 processor instructions. In this list you will find all implemented instructions in the simulator:</p>

	<b>Move:</b><br>
	<p>Move instructions are used to move data from one place (eg from a general register) to another place.</p>
{/if}

<table class="table">
    <thead>
    <tr>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.operandCount')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
    </thead>
    <tbody>
    {#each moveInstructions as opcodeName}
        <tr>
            <th scope="row">{opcodeName}</th>
            <td>{opcodes[opcodeName].run.length}</td>
            <td>{$_('instructions.' + opcodeName)}</td>
        </tr>
    {/each}
    </tbody>
</table>

<hr>
{#if $language === 'sk'}
	<b>Aritmetické inštrukcie:</b><br>
	<p>Aritmetické inštrukcie vykonávajú základné matematické operácie na 8-bitových (bajt) alebo 16 bitových (slovo) hodnotách.</p>
{:else}
	<b>Arithmetic instructions:</b><br>
	<p>Arithmetic instructions perform basic mathematical operations on 8-bit (byte) or 16-bit (word) values.</p>
{/if}
<table class="table">
    <thead>
    <tr>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.operandCount')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
    </tr>
    </thead>
    <tbody>
    {#each arithmeticInstructions as opcodeName}
        <tr>
            <th scope="row">{opcodeName}</th>
            <td>{opcodes[opcodeName].run.length}</td>
            <td>{$_('instructions.' + opcodeName)}</td>
        </tr>
    {/each}
    </tbody>
</table>

<hr>
{#if $language === 'sk'}
	<b>Logické inštrukcie:</b><br>
	<p>Logické inštrukcie vykonávajú logické operácie pre každý bit v skupine bitov.</p>
{:else}
	<b>Logical instructions:</b><br>
	<p>Logical instructions perform logical operations for each bit in a group of bits.</p>
{/if}

	<table class="table">
    <thead>
    <tr>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.operandCount')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
    </tr>
    </thead>
    <tbody>
    {#each logicInstructions as opcodeName}
        <tr>
            <th scope="row">{opcodeName}</th>
            <td>{opcodes[opcodeName].run.length}</td>
            <td>{$_('instructions.' + opcodeName)}</td>
        </tr>
    {/each}
    </tbody>
</table>

<hr>
{#if $language === 'sk'}
	<b>Skokové inštrukcie:</b><br>
	<p>Bez skokových inštrukcií by sme nemohli meniť tok inštrukcií a vytvárať zložitejšie výpočty napríklad pomocou cyklov. Bez nich by sa inštrukcie vykonávali iba v poradí, v ktorom boli definované</p>
{:else}
	<b>Jump instructions:</b><br>
	<p>Without jump instructions we could not change the flow of instructions and create more complex calculations, for example using loops. Without them, the instructions would be executed only in the order in which they were defined.</p>
{/if}
<table class="table">
    <thead>
    <tr>
        <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.operandCount')}</th>
		<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
    </tr>
    </thead>
    <tbody>
    {#each jumpInstructions as opcodeName}
        <tr>
            <th scope="row">{opcodeName}</th>
            <td>{opcodes[opcodeName].run.length}</td>
            <td>{$_('instructions.' + opcodeName)}</td>
        </tr>
    {/each}
    </tbody>
</table>


{#if otherInstructions.length > 0}
    <hr>
	{#if $language === 'sk'}
		<b>Iné inštrukcie:</b><br>
		<p>Inštrukcie, ktoré neboli zaradené do iných skupín</p>
	{:else}
		<b>Other instructions:</b><br>
		<p>Instructions that were not included in other groups</p>
	{/if}
    <table class="table">
        <thead>
        <tr>
            <th scope="col">{$_('views.help.tabs.availableOpcodes.name')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.operandCount')}</th>
			<th scope="col">{$_('views.help.tabs.availableOpcodes.description')}</th>
        </tr>
        </thead>
        <tbody>
        {#each otherInstructions as opcodeName}
            <tr>
                <th scope="row">{opcodeName}</th>
                <td>{opcodes[opcodeName].run.length}</td>
                <td>{$_('instructions.' + opcodeName)}</td>
            </tr>
        {/each}
        </tbody>
    </table>
{/if}
