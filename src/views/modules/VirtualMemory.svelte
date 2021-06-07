<script>
    import {_} from "svelte-i18n";
    import HexEditor from "./HexEditor.svelte";
    import {settings} from "../../stores";
    import {formattedStringToInt} from "../../formatConverter";
    import {MEMORY_SIZE} from "../../stores/config";
    let columns = 8
    let scrollTo = 0

    let innerWidth = 500;

    $: if (innerWidth > 3200) {
        columns = 64
    }
    else if (innerWidth > 2400) {
        columns = 32
    }
    else if (innerWidth > 1950) {
        columns = 16
    }
    else {
        columns = 8
    }

</script>

<style>
    .jumpToOffset-label {
        color: var(--text-color);
    }
</style>

<svelte:window bind:innerWidth={innerWidth}/>

<b>{$_('views.modules.memory')}:</b><br>
<HexEditor COLUMNS={columns} {MEMORY_SIZE} bind:scrollTo>
<!--    <button on:click={()=>columns = 16}>16</button>-->
<!--    <button on:click={()=>columns = 8}>8</button>-->
<!--    <button on:click={()=>columns = 4}>4</button>-->
<!--    <br>-->
    <div class="jumpToOffset-label">{$_('views.memory.jumpToOffset')}:</div>
    <input class="input" type="text" on:keyup={(e)=>scrollTo = formattedStringToInt(e.target.value, $settings.selectedFormat, 32)}>
</HexEditor>



