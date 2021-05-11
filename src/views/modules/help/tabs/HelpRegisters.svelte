<script>
    import {_} from "svelte-i18n";
    import {registers} from "../../../../config";
</script>

<img src="assets/help/registers.png" alt="">
<table class="table">
    <thead>
    <tr>
        <th scope="col">Názov</th>
        <th scope="col">Popis</th>
    </tr>
    </thead>
    <tbody>
    {#each registers as registerName}
        <tr>
            <th scope="row">{registerName}</th>
            <td>{$_('tooltips.registers.' + registerName)}</td>
        </tr>
    {/each}
    </tbody>
</table>
