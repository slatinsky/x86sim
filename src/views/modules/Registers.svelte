<script>
    import Register from "./Register.svelte";
    import {registers, settings} from "../../stores/stores";
    import { _} from 'svelte-i18n'
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

<b>{$_('views.modules.registers')}:</b>
<div class="regContainer">
    <div>
        <Register bind:value={$registers.ip} label="ip" tooltip={$_('tooltips.registers.ip')} bcolor="#64C864"/>
        <Register bind:value={$registers.ax} label="ax" tooltip={$_('tooltips.registers.ax')} bcolor="DARKSLATEGRAY"/>
        <Register bind:value={$registers.bx} label="bx" tooltip={$_('tooltips.registers.bx')}/>
        <Register bind:value={$registers.cx} label="cx" tooltip={$_('tooltips.registers.cx')}/>
        <Register bind:value={$registers.dx} label="dx" tooltip={$_('tooltips.registers.dx')}/>
    </div>
    <div>
        <Register bind:value={$registers.si} label="si" tooltip={$_('tooltips.registers.si')}/>
        <Register bind:value={$registers.di} label="di" tooltip={$_('tooltips.registers.di')}/>
        <Register bind:value={$registers.bp} label="bp" tooltip={$_('tooltips.registers.bp')} bcolor="darkred"/>
        <Register bind:value={$registers.sp} label="sp" tooltip={$_('tooltips.registers.sp')} bcolor="red"/>
    </div>
    <div>
<!--        commented out are flags not yet implemented-->
<!--        <Register bind:value={$registers.cf} label="cf" tooltip={$_('tooltips.registers.cf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.pf} label="pf" tooltip={$_('tooltips.registers.pf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.af} label="af" tooltip={$_('tooltips.registers.af')} bcolor="#008BC0"/>-->
        <Register bind:value={$registers.zf} label="zf" tooltip={$_('tooltips.registers.zf')} bcolor="#008BC0"/>
<!--        <Register bind:value={$registers.sf} label="sf" tooltip={$_('tooltips.registers.sf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.tf} label="tf" tooltip={$_('tooltips.registers.tf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.if} label="if" tooltip={$_('tooltips.registers.if')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.df} label="df" tooltip={$_('tooltips.registers.df')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.of} label="of" tooltip={$_('tooltips.registers.of')} bcolor="#008BC0"/>-->
    </div>
</div>
{#if $settings.developerMode}
    <button on:click={registers.reset}>DEBUG: Prenastav registre</button>
    <br>
    {decValues}
{/if}
