<script>
    import {_} from 'svelte-i18n'
    import {settings} from "../../../../stores/stores";
    import QuestionCircle from "../../../components/QuestionCircle.svelte";

    $: formats = [
        {id: 'hex', text: $_('views.settings.globalSettings.selectFormat.hex')},
        {id: 'signed', text: $_('views.settings.globalSettings.selectFormat.signed')},
        {id: 'unsigned', text: $_('views.settings.globalSettings.selectFormat.unsigned')},
        {id: 'bin', text: $_('views.settings.globalSettings.selectFormat.bin')},
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
    <p>{$_('views.settings.globalSettings.help')}</p>
    <div class="my-3">
        <label for="selectedFormat">{$_('views.settings.globalSettings.labels.selectFormat')} <QuestionCircle tooltip={$_('views.settings.globalSettings.questionCircles.selectFormat')} /></label>
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
        <label class="form-check-label" for="flexSwitchCheckDarkTheme">{$_('views.settings.globalSettings.labels.darkTheme')} <QuestionCircle tooltip={$_('views.settings.globalSettings.questionCircles.darkTheme')} /></label>
    </div>

    <div class="my-3 form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchHistory" bind:checked={$settings.codeExecutionHistory}>
        <label class="form-check-label" for="flexSwitchHistory">{$_('views.settings.globalSettings.labels.codeExecutionHistory')} <QuestionCircle tooltip={$_('views.settings.globalSettings.questionCircles.codeExecutionHistory')} /></label>
    </div>

    <div class="my-3 form-check form-switch">
        <input class="form-check-input" type="checkbox" id="flexSwitchAnimations" bind:checked={animationChecked} on:change={() => $settings.codeExecutionDelay <= 0 ? $settings.codeExecutionDelay = 1 : $settings.codeExecutionDelay = 0}>
        <label class="form-check-label" for="flexSwitchAnimations">{$_('views.settings.globalSettings.labels.animation')} <QuestionCircle tooltip={$_('views.settings.globalSettings.questionCircles.animation')} /></label>
    </div>

    {#if $settings.codeExecutionDelay > 0}
        <label for="rangeAnimation" class="form-label">{$_('views.settings.globalSettings.labels.animationSpeed')} ({$settings.codeExecutionDelay} ms) <QuestionCircle tooltip={$_('views.settings.globalSettings.questionCircles.animationSpeed')} /></label>
        <div>{$_('views.settings.globalSettings.labels.fastAnimation')} <input type="range" class="form-range" min="1" max="1000" id="rangeAnimation" bind:value={$settings.codeExecutionDelay}> {$_('views.settings.globalSettings.labels.slowAnimation')}</div>
    {/if}
</div>
