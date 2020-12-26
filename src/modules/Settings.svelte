<script>
    import {selectedFormat, debug, darkTheme} from "../store/store";

    let formats = [
        {id: 'hex', text: `16-ková sústava`},
        {id: 'signed', text: `10-ková sústava (signed)`},
        {id: 'unsigned', text: `10-ková sústava (unsigned)`},
        {id: 'bin', text: `2-ková sústava`},
        // { id: 'ascii', text: `ascii` }
    ];
</script>

<style>
    #settingsContainer {
        padding: 2rem;
    }
</style>


<div id="settingsContainer">
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

    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDarkTheme" bind:checked={$darkTheme}>
        <label class="form-check-label" for="flexSwitchCheckDarkTheme">Tmavá téma</label>
    </div>

    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchDeveloperMode" bind:checked={$debug}>
        <label class="form-check-label" for="flexSwitchDeveloperMode">Developer mode</label>
    </div>
</div>
