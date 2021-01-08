<script>
    import Register from "./Register.svelte";
    import {selectedFormat, ax, bx, cx, dx, si, di, bp, sp, debug} from "../../store/store";

    function resetNew() {
        $ax = 10
        $bx = 20
        $cx = 30
        $dx = 40
        $si = 50
        $di = 60000
        $bp = 32767
        $sp = -32768
    }

    $: decValues = `DEBUG - ax: ${$ax}, bx: ${$bx}, cx: ${$cx}, dx: ${$dx}, format: ${$selectedFormat}`

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
        <Register bind:value={$ax} label="ax" bcolor="DARKSLATEGRAY"/>
        <Register bind:value={$bx} label="bx"/>
        <Register bind:value={$cx} label="cx"/>
        <Register bind:value={$dx} label="dx"/>
    </div>
    <div>
        <Register bind:value={$si} label="si"/>
        <Register bind:value={$di} label="di"/>
        <Register bind:value={$bp} label="bp" bcolor="darkred"/>
        <Register bind:value={$sp} label="sp" bcolor="red"/>
    </div>
</div>
{#if $debug}
    <button on:click={resetNew}>DEBUG: Prenastav registre</button>
    <br>
    {decValues}
{/if}
