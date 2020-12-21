<script>
    import {onMount, afterUpdate} from 'svelte';
    import Register from "./Register.svelte";
    import {sp} from "../registersStore";
    import * as animateScroll from "svelte-scrollto";

    let stack = [
        {address: 1000, value: 10}
    ]



    $: maxAddress = stack.reduce((currentHighestAddress, currentStackObj) => {
        if (currentStackObj.value !== 0) {
            return Math.max(currentHighestAddress, currentStackObj.address)
        } else {
            return currentHighestAddress
        }
    }, 0)

    function insertItemToStack() {
        stack = [...stack, {address: maxAddress + 2, value: 10}]
    }


    onMount(async () => {
        //debug
        for (let i = 0; i < 20; i++) {
            setTimeout(insertItemToStack, i)
        }
    });

    afterUpdate(() => {
        console.log('sp changed')

        if ($sp % 2 === 0)
            // https://www.npmjs.com/package/svelte-scrollto
            animateScroll.scrollTo({
                container: '#stack',
                element: '.stackSP',
                offset: -150
            })
    });

</script>

<style>
    #stack {
        overflow-y: scroll;
        height: 400px;
        max-width: 250px;
        margin: 1rem
    }
</style>




<b>Zásobník:</b>
<div>
    <div id="stack">
        {#each stack as stackItem (stackItem.address)}
            {#if stackItem.address === $sp}
                <span class="stackSP"><Register bind:value={stackItem.value} label={stackItem.address} bcolor="red" largeSquare={true}/></span>
            {:else if stackItem.address < $sp}
                <Register bind:value={stackItem.value} label={stackItem.address} bcolor="gray" largeSquare={true}/>
            {:else}
                <Register bind:value={stackItem.value} label={stackItem.address} largeSquare={true}/>
            {/if}

            <!--    <div><b>{stackItem.address}:</b> {stackItem.value}</div>-->
        {/each}
    </div>
</div>

<button on:click={insertItemToStack}>DEBUG: insert value to stack</button> <br>
{maxAddress}
{JSON.stringify(stack, null, 2)}
