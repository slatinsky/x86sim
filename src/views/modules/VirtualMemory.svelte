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
    const COLUMNS = 16
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
        /*border-top: 1px solid #333;*/
        /*border-bottom: 1px solid #333;*/
        min-height: 200px;
        height: calc(100vh - 15em);

        max-width: 500px;
        font-family: monospace;
        margin-bottom: 1rem;
    }

    .hexEditorRow {
        display: flex;

        justify-content: flex-start;
    }

    .hexEditorRow-address {
        display: flex;
        min-width: 80px;
        justify-content: flex-end;
        margin-right: 1rem;
    }

    .hexEditorRow-cell {
        color: var(--text-color);
        min-width: 3ch;
    }
    .hexEditorRow-cell:hover,
    .hexEditorRow-ascii:hover{
        background-color: var(--active-secondary-background);
    }

    .hexEditorRow-legend {
        font-weight: bold;
    }
    .hexEditorRow-legend:hover {
        background-color: var(--body-background);
    }

    .hexEditorRow-asciiWrapper {
        display: flex;
    }

    .hexEditorRow-ascii {
        color: var(--text-color);
        min-width: 1ch;
    }

    .hexEditorRow-ascii-deactivated {
        color: var(--white-deactivated-text-color);
    }
</style>

<div class="virtualContainer">
    <div class="hexEditorRow">
        <div class="hexEditorRow-address"><b>Offset</b></div>
        {#each Array(COLUMNS) as _, offset}
            <div class="hexEditorRow-cell hexEditorRow-legend">{offset.toString().padStart(2, '0')}</div>
        {/each}
        <div class="hexEditorRow-asciiWrapper hexEditorRow-legend">
            <div>Decoded text</div>
        </div>
    </div>
    <VirtualList items={rangeOfIntegers} let:item={index} bind:start bind:end itemHeight={19}>
        <!-- this will be rendered for each currently visible item -->
        <div class="hexEditorRow">
            <div class="hexEditorRow-address hexEditorRow-legend">
                {index}:
            </div>

            {#each Array(COLUMNS) as _, offset}
                {#if $memory.hasOwnProperty(index + offset)}
                    <div class="hexEditorRow-cell" on:click={() => changeValue(index + offset)}>{$memory[index + offset]} </div>
                {:else}
                    <div class="hexEditorRow-cell" on:click={() => changeValue(index + offset)}>0 </div>
                {/if}
            {/each}
            <div class="hexEditorRow-asciiWrapper">
                {#each Array(COLUMNS) as _, offset}
                    {#if $memory.hasOwnProperty(index + offset)}
                        <div class="hexEditorRow-ascii" on:click={() => changeValue(index + offset)}>{String.fromCharCode($memory[index + offset])} </div>
                    {:else}
                        <div class="hexEditorRow-ascii hexEditorRow-ascii-deactivated" on:click={() => changeValue(index + offset)}>.</div>
                    {/if}
                {/each}
            </div>
        </div>

    </VirtualList>
<!--    <p>showing {start}-{end} of {MEMORY_SIZE} rows</p>-->
</div>
