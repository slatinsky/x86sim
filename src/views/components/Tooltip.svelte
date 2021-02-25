<script>
    export let tooltip = "";
    export let top = false;
    export let right = false;
    export let bottom = false;
    export let left = false;
    export let active = false;
    export let color = "#757575";

    // https://github.com/Abreu00/svelte-tooltip/blob/master/src/SvelteTooltip.svelte
    import SvelteTooltip from 'svelte-tooltip';
</script>

<style>
    .wrapper {
        color: #fafafa;
    }
</style>

<div class="wrapper">
    <SvelteTooltip tip={tooltip} {active} {left} {right} {bottom} {top}>
        <slot />
    </SvelteTooltip>
</div>
