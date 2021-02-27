<script>
    import { fade } from 'svelte/transition';
    import {onMount, afterUpdate} from 'svelte';
    import Register from "./Register.svelte";
    import * as animateScroll from "svelte-scrollto";
    import {memory, registers, settings} from "../../stores/stores";
    import { _} from 'svelte-i18n'
    import {intToFormattedString} from "../../formatConverter";


    let stack = []


    // does address referenced by stack pointer exist in stack?
    // $: spAddressExistsInStack = stack.filter(stackItem => stackItem.address === $sp).length
    // $: bpAddressExistsInStack = stack.filter(stackItem => stackItem.address === $bp).length
    // TODO: restore original checks
    let spAddressExistsInStack = true
    let bpAddressExistsInStack = true

    function scrollToSP() {
        if (spAddressExistsInStack) {
            // https://www.npmjs.com/package/svelte-scrollto
            animateScroll.scrollTo({
                container: '#stack',
                element: '.stackSP',
                offset: -150
            })
        }
    }

    onMount(async () => {
        // generate stack object
        for (let address=1000; address <= 2000;address+=2) {
            stack.push({address: address, value: 0})
        }

        // redraw
        stack = stack

        // scroll to SP
        setTimeout(scrollToSP, 1000)
    });

    afterUpdate(() => {
        scrollToSP()
    });

</script>

<style>

    #wrapper {
        position: relative;
        width: 100%;
        /*max-width: 250px;*/
    }

    #stack {
        overflow-y: scroll;
        height: 400px;
        margin: 1rem
    }

    #warnings {
        z-index: 20;
        position: absolute;
        background-color: rgba(48, 48, 48, 0.80);
        color: #f3a8a8;
    }

    .warning {
        padding: .5rem 1rem;
    }
</style>


<div id="wrapper">
    <b>{$_('views.modules.stack')}:</b>
    <div id="warnings">
        {#if !spAddressExistsInStack}
            <div class="warning" transition:fade={{ duration: 150 }}>Varovanie: register 'stack pointer' (SP) ukazuje mimo zásobníka</div>
        {/if}
        {#if !bpAddressExistsInStack}
            <div class="warning" transition:fade={{ duration: 150 }}>Varovanie: register 'base pointer' (BP) ukazuje mimo zásobníka</div>
        {/if}
    </div>
    <div id="stack">
        {#each $memory as value, address}
            {#if address > $registers.sp - 10}
                {#if address === $registers.sp}
                    <span class="stackSP">
                        <Register bind:value={value} bits="16" label={intToFormattedString(address, $settings.selectedFormat, 16)} bcolor="red" largeSquare={true}/>
                    </span>
                {:else if address === $registers.bp}
                    <Register bind:value={value} bits="16" label={intToFormattedString(address, $settings.selectedFormat, 16)} bcolor="darkred" largeSquare={true}/>
                {:else if address < $registers.sp}
                    <Register bind:value={value} bits="16" label={intToFormattedString(address, $settings.selectedFormat, 16)} bcolor="gray" largeSquare={true}/>
                {:else}
                    <Register bind:value={value} bits="16" label={intToFormattedString(address, $settings.selectedFormat, 16)} largeSquare={true}/>
                {/if}
            {/if}
        {/each}
    </div>
</div>

<!--{JSON.stringify(stack, null, 2)}-->
