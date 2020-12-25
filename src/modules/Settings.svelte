<script>
    import {selectedFormat, debug} from "../store/store";

    let formats = [
        { id: 'hex', text: `16-ková sústava` },
        { id: 'signed', text: `10-ková sústava (signed)` },
        { id: 'unsigned', text: `10-ková sústava (unsigned)` },
        { id: 'bin', text: `2-ková sústava` },
        // { id: 'ascii', text: `ascii` }
    ];
</script>

<h3>Nastavenia</h3>

<div>
    <label for="selectedFormat">Formát čísel</label>
    <select id="selectedFormat" bind:value={$selectedFormat}>
        {#each formats as format}
            <option value={format.id}>
                {format.text}
            </option>
        {/each}
    </select>
</div>

<div>
    <label for="debugMode">Debug mód</label>
    <select id="debugMode" bind:value={$debug}>
        <option value={true}>Zapnutý</option>
        <option value={false}>Vypnutý</option>
    </select>
</div>

