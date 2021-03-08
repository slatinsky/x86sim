<script>
    import {memory} from "../../stores/stores";

    // documentation https://github.com/sveltejs/svelte-virtual-list
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import {MEMORY_SIZE} from "../../stores/config";

    // const things = [...Array(500).keys()].map(value => {
    //     return { name: value, number: value }
    // })
    const rangeOfIntegers = [...Array(MEMORY_SIZE).keys()]

    let start
    let end
</script>

<style>
    .virtualContainer {
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;
        min-height: 200px;
        height: calc(100vh - 15em);
    }
</style>

<div class="virtualContainer">
    <VirtualList items={rangeOfIntegers} let:item={index} bind:start bind:end>
        <!-- this will be rendered for each currently visible item -->
        {#if $memory.hasOwnProperty(index)}
            <div><b>{index}</b> {$memory[index]}</div>
        {:else}
            <div><b>{index}</b> 0</div>
        {/if}

    </VirtualList>
    <p>showing {start}-{end} of {MEMORY_SIZE} rows</p>
</div>
