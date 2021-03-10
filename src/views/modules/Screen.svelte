<script>
    import { _} from 'svelte-i18n'
    import {range} from "lodash-es";
    import {memory} from "../../stores/stores";
    import {signedToUnsignedInt} from "../../formatConverter";

    let OFFSET = 0  // from which memory address is screen mapped
    let COLUMNS = 80
    let ROWS = 25
    const addresses = range(OFFSET, OFFSET + COLUMNS * ROWS * 2, 2)

    function getColorsClasses(signedByteInt) {
        if (!signedByteInt)
            return

        let byteInt = signedToUnsignedInt(signedByteInt, 8)

        // 4 bits = 16 color combinations
        let backgroundColor = (byteInt & 0xf0) >>> 4
        let foregroundColor = byteInt & 0x0f

        return `color-${foregroundColor} b-color-${backgroundColor}`
    }

    // how is written to screen memory using assembly: https://retrocomputing.stackexchange.com/questions/3053/how-to-write-directly-to-video-memory-in-ms-dos
</script>

<style>
    #screen {
        display: grid;
        grid-template-columns: repeat(80, 1ch); /* 80 = COLUMNS */

        background-color: black;
        padding: .5rem .5rem;
        width: calc(80ch + 2 * .5rem);

        font-family: monospace;
        font-size: 13px;
        text-align: left;
    }

    /* colors from http://www.osdever.net/bkerndev/Docs/printing.htm */
    .color-0 {
        color: black;
    }
    .color-1 {
        color: blue;
    }
    .color-2 {
        color: #00FF00;
    }
    .color-3 {
        color: #00FFFF;
    }
    .color-4 {
        color: red;
    }
    .color-5 {
        color: #CC0099;
    }
    .color-6 {
        color: #663300;
    }
    .color-7 {
        color: #CCCCCC;
    }
    .color-8 {
        color: #444444;
    }
    .color-9 {
        color: #3399FF;
    }
    .color-10 {
        color: #99FF66;
    }
    .color-11 {
        color: #CCFFFF;
    }
    .color-12 {
        color: #FF6600;
    }
    .color-13 {
        color: #FF66FF;
    }
    .color-14 {
        color: #CC6600;
    }
    .color-15 {
        color: white;
    }

    .b-color-0 {
        background-color: black;
    }
    .b-color-1 {
        background-color: blue;
    }
    .b-color-2 {
        background-color: #00FF00;
    }
    .b-color-3 {
        background-color: #00FFFF;
    }
    .b-color-4 {
        background-color: red;
    }
    .b-color-5 {
        background-color: #CC0099;
    }
    .b-color-6 {
        background-color: #663300;
    }
    .b-color-7 {
        background-color: #CCCCCC;
    }
    .b-color-8 {
        background-color: #444444;
    }
    .b-color-9 {
        background-color: #3399FF;
    }
    .b-color-10 {
        background-color: #99FF66;
    }
    .b-color-11 {
        background-color: #CCFFFF;
    }
    .b-color-12 {
        background-color: #FF6600;
    }
    .b-color-13 {
        background-color: #FF66FF;
    }
    .b-color-14 {
        background-color: #CC6600;
    }
    .b-color-15 {
        background-color: white;
    }
</style>

<div>
    <b>{$_('views.modules.screen')}:</b><br>
    <div id="screen">
        {#each addresses as address}
            <span class="{getColorsClasses($memory?.[address])}">
                {#if $memory.hasOwnProperty(address + 1)}
                    {String.fromCharCode($memory[address + 1])}
                {:else}
                    &nbsp;
                {/if}
            </span>
        {/each}
    </div>
</div>

