<script>
    import Tooltip from "../components/Tooltip.svelte";
    import {_} from "svelte-i18n";
    import {settings} from "../../stores";
</script>

<style>
    i {
        font-size: .9rem;
    }
    .btn {
        border-radius: 0;
        font-size: .5rem;
        padding: 0;
        box-shadow: none !important;
    }

    .btn:hover {
        color: inherit !important;
        background-color: inherit !important;
        border-color: inherit !important;
    }

    #showHide-module {
        position: absolute;
        top: -10px;
        right: 0;
        z-index: 10;

    }

    label {
        background-color: white;
    }
</style>

<div id="showHide-module">
    <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
        <Tooltip tooltip={$_('views.modules.codeEditor')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-codeEditor-check" autocomplete="off" bind:checked={$settings.shownModules.showCodeEditor}>
            <label class="btn btn-outline-primary" for="show-codeEditor-check"><i class="fas fa-code"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.calculator')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-calculator-check" autocomplete="off" bind:checked={$settings.shownModules.showCalculator}>
            <label class="btn btn-outline-primary" for="show-calculator-check"><i class="fas fa-calculator"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.registers')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-registers-check" autocomplete="off" bind:checked={$settings.shownModules.showRegisters}>
            <label class="btn btn-outline-primary" for="show-registers-check"><i class="fas fa-microchip"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.screen')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-screen-check" autocomplete="off" bind:checked={$settings.shownModules.showScreen}>
            <label class="btn btn-outline-primary" for="show-screen-check"><i class="fas fa-desktop"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.keyboard')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-keyboard-check" autocomplete="off" bind:checked={$settings.shownModules.showKeyboard}>
            <label class="btn btn-outline-primary" for="show-keyboard-check"><i class="fas fa-keyboard"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.stack')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-stack-check" autocomplete="off" bind:checked={$settings.shownModules.showStack}>
            <label class="btn btn-outline-primary" for="show-stack-check"><i class="fas fa-layer-group"></i></label>
        </Tooltip>
        <Tooltip tooltip={$_('views.modules.memory')} bottom left>
            <input type="checkbox" class="btn-check btn-group-sm" id="show-memory-check" autocomplete="off" bind:checked={$settings.shownModules.showMemory}>
            <label class="btn btn-outline-primary" for="show-memory-check"><i class="fas fa-memory"></i></label>
        </Tooltip>
    </div>
</div>
