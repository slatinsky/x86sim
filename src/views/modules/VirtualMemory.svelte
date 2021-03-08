<script>
    import {memory, programs} from "../../stores/stores";

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

    import Toast from "../components/toast";
    const toast = new Toast()

    function changeValue(address) {
        let currentValue = memory.get(address)
        console.log(address, currentValue)

        let newValue = parseInt(prompt(`Prosím zadajte novú hodnotu pre adresu ${address}`, currentValue));

        if (newValue != null && Number.isInteger(newValue)) {
            memory.set(address, newValue)  // TODO: handle convertion and overflow
        }
        else {
            toast.error(`Zmena hodnoty neúspešná`)
        }
    }

    // TODO: implement scroll to index: https://svelte.dev/repl/bdf5ceb63f6e45f7bb14b90dbd2c11d9?version=3.35.0
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
        color: var(--text-color);
        width: 80px;
    }
    .hexEditorRow-cell:hover {
        background-color: var(--active-secondary-background);
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
                    <div class="hexEditorRow-cell" on:click={() => changeValue(index + offset)}>{$memory[index + offset]} </div>
                {:else}
                    <div class="hexEditorRow-cell" on:click={() => changeValue(index + offset)}>0 </div>
                {/if}
            {/each}
        </div>

    </VirtualList>
    <p>showing {start}-{end} of {MEMORY_SIZE} rows</p>
</div>
