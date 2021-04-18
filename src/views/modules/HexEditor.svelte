<script>
    import { _} from 'svelte-i18n'
    import {memory, registers, settings} from "../../stores/stores";

    // documentation https://github.com/sveltejs/svelte-virtual-list
    import VirtualList from '@sveltejs/svelte-virtual-list';
    import {range} from "lodash-es";

    export let offsetSegmentValue
    $: offsetValue = (signedToUnsignedInt(offsetSegmentValue, 16) << 4)
    export let MEMORY_SIZE

    if (!MEMORY_SIZE) {
        throw "memory size needs to be defined"
    }

    export let COLUMNS = 16
    const ROW_HEIGHT = 19
    $: rangeOfIntegers = range(offsetValue, MEMORY_SIZE + offsetValue, COLUMNS)

    let start
    let end

    import {formattedStringToInt, intToFormattedString, signedToUnsignedInt} from "../../formatConverter";
    import {onMount} from "svelte";

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




    export let followSp = false
    let virtualContainer
    export let scrollTo
    let isMounted = false

    $: sp = ($registers.ss << 4) + $registers.sp
    $: bp = ($registers.ss << 4) + $registers.bp

    $: {
        if (followSp) {
            scrollTo = sp
        }
    }

    $: scrollToAbsolute = scrollTo - offsetValue

    $: if (isMounted) {
        let scrollToPosition = scrollToAbsolute * ROW_HEIGHT / COLUMNS
        let containerElement = virtualContainer.querySelector('.virtualContainer svelte-virtual-list-viewport')
        containerElement.scrollTop = scrollToPosition;
        setTimeout(() => {
            // dirty fix - set scroll position again after 50 ms if it didn't scroll correctly
            // if it didn't scroll correctly - scrollTop was set to zero
            let newPosition = containerElement.scrollTop
            if (newPosition === 0)  {
                containerElement.scrollTop = scrollToPosition
            }
        }, 50)
    }

    onMount(() => {
        isMounted = true
    })
</script>

<style>
    .virtualContainer {
        /*border-top: 1px solid #333;*/
        /*border-bottom: 1px solid #333;*/
        min-height: 200px;
        height: calc(100vh - 15em);
        /*max-height: 600px;*/

        /*max-width: 600px;*/
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
    .sp {
        background-color: red;
        color: white;
    }
    .bp {
        background-color: darkred;
        color: white;
    }
    .bp.sp {
        background-color: #c50000;  /* red and darkred average*/
        color: white;
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

    .hex-absolute-warning {
        backdrop-filter: blur(5px);
        background-color: rgb(153, 235, 255, 0.67);
        padding: .5rem 1rem;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 10;
    }
</style>




<slot />
<input class="focusableHiddenInput" type="text" bind:value={inputValue} bind:this={inputElement} on:keyup={changeValueInput} on:blur={()=> changeCurrentlyEditedAddress(-1)}>
<div class="virtualContainer" bind:this={virtualContainer}>
    <div class="hexEditorRow">
        <div class="hexEditorRow-address"><b></b></div>
        {#each Array(COLUMNS) as _, offset}
            <div class="hexEditorRow-cell hexEditorRow-legend">{intToFormattedString(offset, $settings.selectedFormat, 8).padStart(2, '0')}</div>
        {/each}
        {#if COLUMNS >= 16}
            <div class="hexEditorRow-asciiWrapper hexEditorRow-legend">
                <div>{$_('views.memory.decodedText')}</div>
            </div>
        {/if}
    </div>
    <VirtualList items={rangeOfIntegers} let:item={index} bind:start bind:end itemHeight={ROW_HEIGHT}>
        <!-- this will be rendered for each currently visible item -->
        <div class="hexEditorRow">
            <div class="hexEditorRow-address hexEditorRow-legend">
                {intToFormattedString(index, $settings.selectedFormat, 32)}:
            </div>

            {#each Array(COLUMNS) as _, offset}
                <div class="hexEditorRow-cell {currentlyEditedAddress === index + offset ? 'hexEditorRow-cell-editing' : ''}  {(index + offset === sp || index + offset === sp + 1) ? 'sp' : ''} {(index + offset === bp || index + offset === bp + 1) ? 'bp' : ''}" on:click={() => changeValue(index + offset)}>
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
</div>

{#if currentlyEditedAddress !== -1}
    <div class="hex-absolute-warning">
        <div>{$_('views.memory.currentlyEditing')}: {intToFormattedString(currentlyEditedAddress, $settings.selectedFormat, 16)}. {$_('views.memory.escToExit')}</div>
    </div>
{/if}

