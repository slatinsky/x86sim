<script>
    import Register from "./Register.svelte";
    import {registers} from "../../stores/stores";
    import {selectedFormat, debug} from "../../storeOld/store";

    $: decValues = `DEBUG - ax: ${$registers.ax}, bx: ${$registers.bx}, cx: ${$registers.cx}, dx: ${$registers.dx}, format: ${$selectedFormat}`

</script>

<style>
    .regContainer {
        display: flex;
    }

    .regContainer > div {
        padding: 1rem;
    }
</style>

<b>Registre:</b>
<div class="regContainer">
    <div>
        <Register bind:value={$registers.ax} label="ax" bcolor="DARKSLATEGRAY"/>
        <Register bind:value={$registers.bx} label="bx"/>
        <Register bind:value={$registers.cx} label="cx"/>
        <Register bind:value={$registers.dx} label="dx"/>
    </div>
    <div>
        <Register bind:value={$registers.si} label="si"/>
        <Register bind:value={$registers.di} label="di"/>
        <Register bind:value={$registers.bp} label="bp" bcolor="darkred"/>
        <Register bind:value={$registers.sp} label="sp" bcolor="red"/>
    </div>
</div>
{#if $debug}
    <button on:click={registers.reset}>DEBUG: Prenastav registre</button>
    <br>
    {decValues}
{/if}
