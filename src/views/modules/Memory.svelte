<script>
    import {memory, settings} from "../../stores";
    import {_} from 'svelte-i18n'
    import FormatInput from "../components/FormatInput.svelte";
</script>

<style>
    span {
        margin: .2rem
    }

    .mainMemory {
        min-width: 630px;
    }
</style>

<div class="mainMemory">
    <b>{$_('views.modules.memory')}:</b><br>
    {#if $memory}
        {#each $memory as memoryCell, address}
            {#if address < 32}
                <span>
                    {#if address % 4 === 0}
                        <b>{address}</b>
                    {/if}
                    <FormatInput bind:value={memoryCell} bits="16" />
                </span>
                {#if address % 4 === 3}
                    <br>
                {/if}
            {/if}
        {/each}
    {/if}
</div>

{#if $settings.developerMode}
    <button on:click={memory.reset}>Zresetovať pamäť</button>
    <button on:click={()=>memory.set(0, 50)}>Nastav na adrese 0 hodnotu 50</button>
    <button on:click={()=>console.log(memory.reduce())}>Vypíš redukovaný objekt</button>
{/if}
