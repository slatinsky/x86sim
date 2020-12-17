<script>
    import {onMount} from 'svelte';
    import Register from "./Register.svelte";

    let stack = [
        {address: 0, value: 10}
    ]

    $: maxAddress = stack.reduce((currentHighestAddress, currentStackObj) => {
        if (currentStackObj.value !== 0) {
            return Math.max(currentHighestAddress, currentStackObj.address)
        } else {
            return currentHighestAddress
        }
    }, 0)

    function insertItemToStack() {
        stack = [{address: maxAddress + 2, value: 10}, ...stack]
    }


    onMount(async () => {
        //debug
        for (let i = 0; i < 20; i++) {
            setTimeout(insertItemToStack, i)
        }
    });

</script>

<style>
    #stack {
        overflow-y: scroll;
        height: 400px;
        max-width: 300px;
        margin: 1rem
    }
</style>




<b>Zásobník:</b>
<div id="stack">
    {#each stack as stackItem (stackItem.address)}
        <Register bind:value={stackItem.value} label={stackItem.address}/>
        <!--    <div><b>{stackItem.address}:</b> {stackItem.value}</div>-->
    {/each}
</div>

<button on:click={insertItemToStack}>DEBUG: insert value to stack</button> <br>
{maxAddress}
{JSON.stringify(stack, null, 2)}
