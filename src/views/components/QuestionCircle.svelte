<script>
    import Tooltip from "./Tooltip.svelte";
    export let tooltip
</script>

<style>
    i {
        color: var(--text-color);
    }
</style>

<Tooltip {tooltip} right>
    <i class="fas fa-question-circle"></i>
</Tooltip>
