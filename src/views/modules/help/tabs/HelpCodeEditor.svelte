<script>
    import {opcodes} from "../../../../stores/stores";
    import {_} from "svelte-i18n";
</script>

<p>V editore kódu píšete assembler kód. Podporovaný je obmedzená podmnožina inštrukcií intel procesora x86. Podporované inštrukcie:</p>
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    {#each Object.keys(opcodes).sort() as opcodeName}
        <tr>
            <th scope="row">{opcodeName}</th>
            <td>{$_('instructions.' + opcodeName)}</td>
        </tr>
    {/each}
    </tbody>
</table>

<p>V editore kliknutím na bočný panel vedľa adries nastavujete/rušíte breakpointy, na ktorých sa program počas spusteného programu pozastaví</p>
<img src="/assets/help/breakpoint.png" alt="">

<p>Editor podporuje aj <a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" target="_blank">množstvo klávesových skratiek</a></p>
