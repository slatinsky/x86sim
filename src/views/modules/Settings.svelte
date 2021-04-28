<script>
    import {settings} from "../../stores/settings";
    import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../../stores/config";
    import { _} from 'svelte-i18n'


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

    input {
        max-width: 300px;
    }
</style>


<div id="settingsContainer">
    <h3>{$_('views.navigation.settings')}</h3>

    <div>
        <label for="selectedFormat">Formát čísel</label>
        <select id="selectedFormat" bind:value={$settings.selectedFormat}>
            {#each formats as format}
                <option value={format.id}>
                    {format.text}
                </option>
            {/each}
        </select>
    </div>

    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDarkTheme" bind:checked={$settings.darkTheme}>
        <label class="form-check-label" for="flexSwitchCheckDarkTheme">Tmavá téma</label>
    </div>

    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchDeveloperMode" bind:checked={$settings.developerMode}>
        <label class="form-check-label" for="flexSwitchDeveloperMode">Developer mode</label>
    </div>

    <button class="btn btn-outline-danger" on:click={() => {
        localStorage.clear()
        location.reload()
    }}>zresetovať celý obsah simulátora (vymaže VŠETKY ÚDAJE) </button>

    <div class="mb-3">
        <label for="delayInput" class="form-label">Oneskorenie vykonávania inštrukcií (v ms)</label>
        <input type="number" min="0" class="form-control" id="delayInput" aria-describedby="emailHelp" bind:value={$settings.codeExecutionDelay}>
        <div id="delayInputHelp" class="form-text">0 pre žiadne oneskorenie. Ak je nastavené na 0, tak maximum vykonaných inštrukcií je {MAX_EXECUTED_INSTRUCTION_COUNT} ako prevencia nekonečného cyklu</div>
    </div>

</div>
