<script>
    import { fade } from 'svelte/transition';
    import {onMount, afterUpdate} from 'svelte';
    import Register from "./Register.svelte";
    import {sp, bp} from "../registersStore";
    import * as animateScroll from "svelte-scrollto";


    let stack = []






    // $: maxAddress = stack.reduce((currentHighestAddress, currentStackObj) => {
    //     if (currentStackObj.value !== 0) {
    //         return Math.max(currentHighestAddress, currentStackObj.address)
    //     } else {
    //         return currentHighestAddress
    //     }
    // }, 0)

    // function insertItemToStack() {
    //     stack = [...stack, {address: maxAddress + 2, value: 10}]
    // }


    // onMount(async () => {
    //     //debug
    //     for (let i = 0; i < 200; i++) {
    //         setTimeout(insertItemToStack, i)
    //     }
    // });

    // does address referenced by stack pointer exist in stack?
    $: spAddressExistsInStack = stack.filter(stackItem => stackItem.address === $sp).length
    $: bpAddressExistsInStack = stack.filter(stackItem => stackItem.address === $bp).length

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
        for (let address=1000; address < 2000;address+=2) {
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
        max-width: 250px;
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




<b>Zásobník:</b>

<div id="wrapper">
    <div id="warnings">
        {#if !spAddressExistsInStack}
            <div class="warning" transition:fade={{ duration: 150 }}>Varovanie: register 'stack pointer' (SP) ukazuje mimo zásobníka</div>
        {/if}
        {#if !bpAddressExistsInStack}
            <div class="warning" transition:fade={{ duration: 150 }}>Varovanie: register 'base pointer' (BP) ukazuje mimo zásobníka</div>
        {/if}
    </div>
    <div id="stack">
        {#each stack as stackItem (stackItem.address)}
            {#if stackItem.address === $sp}
                <span class="stackSP"><Register bind:value={stackItem.value} label={stackItem.address} bcolor="red" largeSquare={true}/></span>
            {:else if stackItem.address === $bp}
                <Register bind:value={stackItem.value} label={stackItem.address} bcolor="darkred" largeSquare={true}/>
            {:else if stackItem.address < $sp}
                <Register bind:value={stackItem.value} label={stackItem.address} bcolor="gray" largeSquare={true}/>
            {:else}
                <Register bind:value={stackItem.value} label={stackItem.address} largeSquare={true}/>
            {/if}

            <!--    <div><b>{stackItem.address}:</b> {stackItem.value}</div>-->
        {/each}
    </div>
</div>

<!--{JSON.stringify(stack, null, 2)}-->
