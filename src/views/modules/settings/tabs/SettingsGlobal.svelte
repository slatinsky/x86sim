<script>
    import {_} from 'svelte-i18n'
    import {settings} from "../../../../stores/stores";
    import {MAX_EXECUTED_INSTRUCTION_COUNT} from "../../../../stores/config";
    import QuestionCircle from "../../../components/QuestionCircle.svelte";

    let formats = [
        {id: 'hex', text: `16-ková sústava`},
        {id: 'signed', text: `10-ková sústava (signed)`},
        {id: 'unsigned', text: `10-ková sústava (unsigned)`},
        {id: 'bin', text: `2-ková sústava`},
        // { id: 'ascii', text: `ascii` }
    ];

    let animationChecked
    $: animationChecked = $settings.codeExecutionDelay > 0;
</script>

<style>
    div {
        color: var(--text-color);
    }

    input, select {
        max-width: 300px;
    }
</style>

<div>
    <p>These settings will be applied to all projects</p>
    <div class="my-3">
        <label for="selectedFormat">Formát čísel <QuestionCircle tooltip={"Príklad: 10-ková signed: -11, 10-ková unsigned: 65525, 16-ková: 0xFFF5, 2-ková: 1111111111110101"} /></label>
        <select id="selectedFormat" class="form-select" bind:value={$settings.selectedFormat}>
            {#each formats as format}
                <option value={format.id}>
                    {format.text}
                </option>
            {/each}
        </select>
    </div>

    <div class="my-3 form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDarkTheme" bind:checked={$settings.darkTheme}>
        <label class="form-check-label" for="flexSwitchCheckDarkTheme">Tmavá téma <QuestionCircle tooltip={"Simulator will switch color palette to darker colors"} /></label>
    </div>


    <div class="my-3 form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchAnimations" bind:checked={animationChecked} on:change={() => $settings.codeExecutionDelay <= 0 ? $settings.codeExecutionDelay = 1 : $settings.codeExecutionDelay = 0}>
        <label class="form-check-label" for="flexSwitchAnimations">Animovať vykonávanie inštrukcií <QuestionCircle tooltip={"Ak je vypnuté, inštrukcie sa vykonajú okamžite bez animácie"} /></label>
    </div>

    {#if $settings.codeExecutionDelay > 0}
        <label for="rangeAnimation" class="form-label">Rýchlosť animácie ({$settings.codeExecutionDelay} ms) <QuestionCircle tooltip={"Čas čakania medzi vykonávanými inštrukciami (v ms). Menšie číslo = rýchlejšia animácia"} /></label>
        <div>rýchla <input type="range" class="form-range" min="1" max="1000" id="rangeAnimation" bind:value={$settings.codeExecutionDelay}> pomalá</div>
    {/if}

<!--    {#if $settings.codeExecutionDelay > 0}-->
<!--        <div class="my-3">-->
<!--            <label for="delayInput" class="form-label">Rýchlosť animácie <QuestionCircle tooltip={"Čas čakania medzi vykonávanými inštrukciami (v ms). Menšie číslo = rýchlejšia animácia"} /></label>-->
<!--            <input type="number" min="0" class="form-control" id="delayInput" aria-describedby="emailHelp" bind:value={$settings.codeExecutionDelay}>-->
<!--&lt;!&ndash;            <div id="delayInputHelp" class="form-text">0 pre žiadne oneskorenie. Ak je nastavené na 0, tak maximum vykonaných inštrukcií je {MAX_EXECUTED_INSTRUCTION_COUNT} ako prevencia nekonečného cyklu</div>&ndash;&gt;-->
<!--        </div>-->
<!--    {/if}-->

<!--    <div class="my-3 form-check form-switch">-->
<!--        <input class="form-check-input" type="checkbox" id="flexSwitchDeveloperMode" bind:checked={$settings.developerMode}>-->
<!--        <label class="form-check-label" for="flexSwitchDeveloperMode">Developer mode</label>-->
<!--    </div>-->




</div>
