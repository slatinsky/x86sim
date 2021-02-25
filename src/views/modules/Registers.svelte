<script>
    import Register from "./Register.svelte";
    import {registers, settings} from "../../stores/stores";

    $: decValues = `DEBUG - ip: ${$registers.ip}, ax: ${$registers.ax}, bx: ${$registers.bx}, cx: ${$registers.cx}, dx: ${$registers.dx}, format: ${$settings.selectedFormat}`

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
        <Register bind:value={$registers.ip} label="ip" bcolor="#64C864"/>
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
    <div>
        <Register bind:value={$registers.cf} label="cf" bcolor="#008BC0"/>
        <Register bind:value={$registers.pf} label="pf" bcolor="#008BC0"/>
        <Register bind:value={$registers.af} label="af" bcolor="#008BC0"/>
        <Register bind:value={$registers.zf} label="zf" bcolor="#008BC0"/>
        <Register bind:value={$registers.sf} label="sf" bcolor="#008BC0"/>
        <Register bind:value={$registers.tf} label="tf" bcolor="#008BC0"/>
        <Register bind:value={$registers.if} label="if" bcolor="#008BC0"/>
        <Register bind:value={$registers.df} label="df" bcolor="#008BC0"/>
        <Register bind:value={$registers.of} label="of" bcolor="#008BC0"/>
    </div>
</div>
{#if $settings.developerMode}
    <button on:click={registers.reset}>DEBUG: Prenastav registre</button>
    <br>
    {decValues}
{/if}
