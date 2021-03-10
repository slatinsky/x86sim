<script>
    import {memory, programs, settings} from "../../stores/stores";

    // documentation https://github.com/sveltejs/svelte-virtual-list
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import {MEMORY_SIZE} from "../../stores/config";
    import {range} from "lodash-es";

    const COLUMNS = 16
    const ROW_HEIGHT = 19
    const rangeOfIntegers = range(0, MEMORY_SIZE, COLUMNS)

    let start
    let end

    import Toast from "../components/toast";
    import {formattedStringToInt, intToFormattedString} from "../../formatConverter";
    const toast = new Toast()

    function changeValue(address) {
        changeCurrentlyEditedAddress(address)
        inputElement.focus()
    }

    let inputValue
    let inputElement
    let currentlyEditedAddress = -1

    function changeCurrentlyEditedAddress(toAddress) {
        if (toAddress < -1)
            toAddress = -1

        if (toAddress >= MEMORY_SIZE)
            toAddress = MEMORY_SIZE -1

        inputValue = ""
        currentlyEditedAddress = toAddress
    }

    function changeValueInput(e) {
        if (e.key === 'Escape') {
            changeCurrentlyEditedAddress(-1)
        }
        else if (e.key === 'ArrowDown') {
            changeCurrentlyEditedAddress(currentlyEditedAddress + COLUMNS)
        }
        else if (e.key === 'ArrowUp') {
            changeCurrentlyEditedAddress(currentlyEditedAddress - COLUMNS)
        }
        else if (e.key === 'ArrowLeft') {
            changeCurrentlyEditedAddress(currentlyEditedAddress - 1)
        }
        else if (e.key === 'ArrowRight') {
            changeCurrentlyEditedAddress(currentlyEditedAddress + 1)
        }
        else if (e.key === 'Delete') {
            memory.set(currentlyEditedAddress, 0)
            changeCurrentlyEditedAddress(currentlyEditedAddress + 1)
        }
        else if (e.key === 'Backspace') {
            inputValue = intToFormattedString(memory.get(currentlyEditedAddress), 'hex', 8).slice(0, -1)
            memory.set(currentlyEditedAddress, formattedStringToInt(inputValue, 'hex', 8))
        }
        if (inputValue.length > 0 && currentlyEditedAddress !== -1) {
            memory.set(currentlyEditedAddress, formattedStringToInt(inputValue, 'hex', 8))

            if (inputValue.length >= 2) {
                changeCurrentlyEditedAddress(currentlyEditedAddress + 1)
            }
        }
    }


    let virtualContainer
    let scrollTo

    function jumpToOffset() {
        if (scrollTo) {
            let scrollToInt = formattedStringToInt(scrollTo, $settings.selectedFormat, 32)
            virtualContainer.querySelector('.virtualContainer svelte-virtual-list-viewport').scrollTop = scrollToInt * ROW_HEIGHT / COLUMNS;
        }
    }
</script>

<style>
    .virtualContainer {
        /*border-top: 1px solid #333;*/
        /*border-bottom: 1px solid #333;*/
        min-height: 200px;
        height: calc(100vh - 15em);
        max-height: 600px;

        max-width: 600px;
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
        min-width: 2ch;
        padding: 0 .5ch;
    }
    .hexEditorRow-cell:hover,
    .hexEditorRow-ascii:hover,
    .hexEditorRow-cell-editing{
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

    .focusableHiddenInput {
        width: 1px;
        height: 1px;
        position: absolute;
        opacity: 0;
    }
</style>

{#if currentlyEditedAddress !== -1}
    <div>Práve editujete pamäť na adrese: {intToFormattedString(currentlyEditedAddress, $settings.selectedFormat, 16)}. Esc pre ukončenie</div>
{:else}
    <br>
{/if}


Skočiť na offset: <input type="text" bind:value={scrollTo} on:keyup={jumpToOffset}>
<input class="focusableHiddenInput" type="text" bind:value={inputValue} bind:this={inputElement} on:keyup={changeValueInput} on:blur={()=> changeCurrentlyEditedAddress(-1)}>
<div class="virtualContainer" bind:this={virtualContainer}>
    <div class="hexEditorRow">
        <div class="hexEditorRow-address"><b>Offset</b></div>
        {#each Array(COLUMNS) as _, offset}
            <div class="hexEditorRow-cell hexEditorRow-legend">{intToFormattedString(offset, $settings.selectedFormat, 8).padStart(2, '0')}</div>
        {/each}
        <div class="hexEditorRow-asciiWrapper hexEditorRow-legend">
            <div>Decoded text</div>
        </div>
    </div>
    <VirtualList items={rangeOfIntegers} let:item={index} bind:start bind:end itemHeight={ROW_HEIGHT}>
        <!-- this will be rendered for each currently visible item -->
        <div class="hexEditorRow">
            <div class="hexEditorRow-address hexEditorRow-legend">
                {intToFormattedString(index, $settings.selectedFormat, 32)}:
            </div>

            {#each Array(COLUMNS) as _, offset}
                    <div class="hexEditorRow-cell {currentlyEditedAddress === index + offset ? 'hexEditorRow-cell-editing' : ''}" on:click={() => changeValue(index + offset)}>
                        {#if $memory.hasOwnProperty(index + offset)}
                            {intToFormattedString($memory[index + offset], 'hex', 8).padStart(2, '0')}
                        {:else}
                            00
                        {/if}
                    </div>
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
