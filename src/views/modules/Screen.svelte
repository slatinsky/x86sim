<script>
    import { _} from 'svelte-i18n'
    import {range} from "lodash-es";
    import {memory} from "../../stores/stores";

    let OFFSET = 10  // from which memory address is screen mapped
    let COLUMNS = 60
    let ROWS = 10
    const addresses = range(OFFSET, OFFSET + COLUMNS * ROWS, 1)

    // how is written to screen memory using assembly: https://retrocomputing.stackexchange.com/questions/3053/how-to-write-directly-to-video-memory-in-ms-dos
</script>

<style>
    #screen {
        display: grid;
        grid-template-columns: repeat(60, 1ch); /* 60 = COLUMNS */

        /*width: 560px;*/

        background-color: black;
        padding: .5rem 1rem;

        font-family: monospace;
        font-size: 16px;
        text-align: left;

    }

    #screen span {
        color: darkgray;
    }
</style>

<div>
    <b>{$_('views.modules.screen')}:</b><br>
    <div id="screen">
        {#each addresses as address}
            {#if $memory.hasOwnProperty(address)}
                <span>{String.fromCharCode($memory[address])}</span>
            {:else}
                <span>.</span>
            {/if}
        {/each}
    </div>
<!--    <div id="screen">-->
<!--        {#each lines as line}-->
<!--            <div><span>{line}</span></div>-->
<!--        {/each}-->
<!--    </div>-->
</div>

