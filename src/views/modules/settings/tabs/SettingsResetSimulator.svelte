<script>
    import {programs} from "../../../../stores/stores"
    import {_} from "svelte-i18n";
</script>

<style>
    div {
        color: var(--text-color);
    }

    strong {
        color: red;
    }
</style>

<div>{$_('views.settings.resetSimulatorDataSettings.resetAllBlack')}</div>
<div>
    <strong>{$_('views.settings.resetSimulatorDataSettings.resetAllRed')}</strong>
</div>

<button class="my-3 btn btn-outline-danger" on:click={() => {
        localStorage.clear()
        location.reload()
    }}>{$_('views.settings.resetSimulatorDataSettings.resetAllBtn')}</button>



<div class="mt-5">{$_('views.settings.resetSimulatorDataSettings.resetProjectsBlack')}</div>
<div>
    <strong>{$_('views.settings.resetSimulatorDataSettings.resetProjectsRed')}</strong>
</div>
<button class="my-3 btn btn-outline-danger" on:click={() => {
    programs.deleteAllProjects()
    location.reload()
}}>{$_('views.settings.resetSimulatorDataSettings.resetProjectsBtn')}</button> <!-- location.reload() may not be needed, but simulator sometimes freezes without it for some reason -->
