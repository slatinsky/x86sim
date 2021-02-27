<script>
    import Register from "./Register.svelte";
    import {registers, settings} from "../../stores/stores";
    import {_} from 'svelte-i18n'
    import FormatInput from "../components/FormatInput.svelte";

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
        <Register bind:value={$registers.ip} bits="16" label="ip" tooltip={$_('tooltips.registers.ip')} bcolor="#64C864"/>
        <Register bind:value={$registers.ax} bits="16" label="ax" tooltip={$_('tooltips.registers.ax')} bcolor="DARKSLATEGRAY"/>
        <Register bind:value={$registers.bx} bits="16" label="bx" tooltip={$_('tooltips.registers.bx')}/>
        <Register bind:value={$registers.cx} bits="16" label="cx" tooltip={$_('tooltips.registers.cx')}/>
        <Register bind:value={$registers.dx} bits="16" label="dx" tooltip={$_('tooltips.registers.dx')}/>
    </div>
    <div>
        <Register bind:value={$registers.si} bits="16" label="si" tooltip={$_('tooltips.registers.si')}/>
        <Register bind:value={$registers.di} bits="16" label="di" tooltip={$_('tooltips.registers.di')}/>
        <Register bind:value={$registers.bp} bits="16" label="bp" tooltip={$_('tooltips.registers.bp')} bcolor="darkred"/>
        <Register bind:value={$registers.sp} bits="16" label="sp" tooltip={$_('tooltips.registers.sp')} bcolor="red"/>
    </div>
    <div>
<!--        commented out are flags not yet implemented-->
<!--        <Register bind:value={$registers.cf} bits="2" label="cf" tooltip={$_('tooltips.registers.cf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.pf} bits="2" label="pf" tooltip={$_('tooltips.registers.pf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.af} bits="2" label="af" tooltip={$_('tooltips.registers.af')} bcolor="#008BC0"/>-->
        <Register bind:value={$registers.zf} bits="2" label="zf" tooltip={$_('tooltips.registers.zf')} bcolor="#008BC0"/>
<!--        <Register bind:value={$registers.sf} bits="2" label="sf" tooltip={$_('tooltips.registers.sf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.tf} bits="2" label="tf" tooltip={$_('tooltips.registers.tf')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.if} bits="2" label="if" tooltip={$_('tooltips.registers.if')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.df} bits="2" label="df" tooltip={$_('tooltips.registers.df')} bcolor="#008BC0"/>-->
<!--        <Register bind:value={$registers.of} bits="2" label="of" tooltip={$_('tooltips.registers.of')} bcolor="#008BC0"/>-->
    </div>
</div>
{#if $settings.developerMode}
    <button on:click={registers.reset}>DEBUG: Prenastav registre</button>
    <br>
    {decValues}
{/if}
