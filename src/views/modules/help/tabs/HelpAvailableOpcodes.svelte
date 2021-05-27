<script>
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
</script>

<p>Vysvetlenie niektorých dôležitých pojmov na tejto stránke pomocníka:</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Vysvetlenie</th>
        <th scope="col">Príklad</th>
    </tr>
    </thead>
    <tbody>
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
    </tbody>
</table>

<hr>

<p>Podporovaná je obmedzená podmnožina inštrukcií intel procesora x86. V tomto zozname nájdete všetky implementované inštrukcie v simulátore:</p>

<b>Presunové:</b><br>
<p>Presunové inštrukcie majú za úlohu presun dát z jedného miesta (napríklad zo všeobecného registra) na iné miesto.</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Operandov</th>
        <th scope="col">Popis</th>
    </tr>
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
<b>Aritmetické inštrukcie:</b><br>
<p>Aritmetické inštrukcie vykonávajú základné matematické operácie na 8-bitových (bajt) alebo 16 bitových (slovo) hodnotách.</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Operandov</th>
        <th scope="col">Popis</th>
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
<b>Logické inštrukcie:</b><br>
<p>Logické inštrukcie vykonávajú logické operácie pre každý bit v skupine bitov.</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Operandov</th>
        <th scope="col">Popis</th>
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
<b>Skokové inštrukcie:</b><br>
<p>Bez skokových inštrukcií by sme nemohli meniť tok inštrukcií a vytvárať zložitejšie výpočty napríklad pomocou cyklov. Bez nich by sa inštrukcie vykonávali iba v poradí, v ktorom boli definované</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Operandov</th>
        <th scope="col">Popis</th>
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
    <b>Iné inštrukcie:</b><br>
    <p>Inštrukcie, ktoré neboli zaradené do iných skupín</p>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">Názov</th>
            <th scope="col">Operandov</th>
            <th scope="col">Popis</th>
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
