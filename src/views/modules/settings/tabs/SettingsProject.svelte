<script>
    import {_} from "svelte-i18n";
    import {settings, projectName} from "../../../../stores/stores";
    import QuestionCircle from "../../../components/QuestionCircle.svelte";
</script>

<style>
</style>


<div id="main">
    <p>{$_('views.settings.projectSettings.help', {
        values: {
            projectName: $projectName
        }
    })}</p>
    <p>{$_('views.settings.projectSettings.labels.shownModules')} <QuestionCircle tooltip={$_('views.settings.projectSettings.questionCircles.shownModules')} /></p>
    <div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showCodeEditor" bind:checked={$settings.shownModules.showCodeEditor}>
            <label class="form-check-label" for="flexSwitch-showCodeEditor"><i class="fas fa-code"></i> {$_('views.modules.codeEditor')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showCalculator" bind:checked={$settings.shownModules.showCalculator}>
            <label class="form-check-label" for="flexSwitch-showCalculator"><i class="fas fa-calculator"></i> {$_('views.modules.calculator')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showRegisters" bind:checked={$settings.shownModules.showRegisters}>
            <label class="form-check-label" for="flexSwitch-showRegisters"><i class="fas fa-microchip"></i> {$_('views.modules.registers')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showScreen" bind:checked={$settings.shownModules.showScreen}>
            <label class="form-check-label" for="flexSwitch-showScreen"><i class="fas fa-desktop"></i> {$_('views.modules.screen')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showKeyboard" bind:checked={$settings.shownModules.showKeyboard}>
            <label class="form-check-label" for="flexSwitch-showKeyboard"><i class="fas fa-keyboard"></i> {$_('views.modules.keyboard')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showStack" bind:checked={$settings.shownModules.showStack}>
            <label class="form-check-label" for="flexSwitch-showStack"><i class="fas fa-layer-group"></i> {$_('views.modules.stack')}</label>
        </div>
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="flexSwitch-showMemory" bind:checked={$settings.shownModules.showMemory}>
            <label class="form-check-label" for="flexSwitch-showMemory"><i class="fas fa-memory"></i> {$_('views.modules.memory')}</label>
        </div>
    </div>
</div>
