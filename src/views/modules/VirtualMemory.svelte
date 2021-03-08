<script>
    import {memory} from "../../stores/stores";

    // documentation https://github.com/sveltejs/svelte-virtual-list
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import {MEMORY_SIZE} from "../../stores/config";
    import {range} from "lodash-es";

    // const things = [...Array(500).keys()].map(value => {
    //     return { name: value, number: value }
    // })
    // const rangeOfIntegers = [...Array(MEMORY_SIZE).keys()]
    const COLUMNS = 4
    const rangeOfIntegers = range(0, MEMORY_SIZE, COLUMNS)

    let start
    let end
</script>

<style>
    .virtualContainer {
        border-top: 1px solid #333;
        border-bottom: 1px solid #333;
        min-height: 200px;
        height: calc(100vh - 15em);

        max-width: 320px;
    }

    .hexEditorRow {
        display: flex;

        justify-content: space-between;
    }

    .hexEditorRow-address {
        display: flex;
        width: 80px;
        justify-content: flex-end;
        margin-right: 1rem;
    }

    .hexEditorRow-cell {
        width: 80px;
    }
</style>

<div class="virtualContainer">
    <VirtualList items={rangeOfIntegers} let:item={index} bind:start bind:end itemHeight={24}>
        <!-- this will be rendered for each currently visible item -->
        <div class="hexEditorRow">
            <div class="hexEditorRow-address">
                <b>{index}:</b>
            </div>

            {#each Array(COLUMNS) as _, offset}
                {#if $memory.hasOwnProperty(index + offset)}
                    <div class="hexEditorRow-cell">{$memory[index + offset]} </div>
                {:else}
                    <div class="hexEditorRow-cell">0 </div>
                {/if}
            {/each}
        </div>

    </VirtualList>
    <p>showing {start}-{end} of {MEMORY_SIZE} rows</p>
</div>
