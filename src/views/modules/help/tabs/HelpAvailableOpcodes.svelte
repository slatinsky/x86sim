<script>
    import {opcodes} from "../../../../stores/stores";
    import {_} from "svelte-i18n";
</script>

<p>Podporovaná je obmedzená podmnožina inštrukcií intel procesora x86. Podporované inštrukcie:</p>
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
