<script>
    import {_} from "svelte-i18n";
    import {registers, settings} from "../../stores";
    import HexEditor from "./HexEditor.svelte";
    import {SEGMENT_MEMORY_SIZE} from "../../stores/config";
    import {formattedStringToInt} from "../../formatConverter";
    let columns = 2
    let scrollTo
</script>

<style>
    .jumpToOffset-label {
        color: var(--text-color);
    }
</style>

<b>{$_('views.modules.stack')}:</b><br>
<HexEditor COLUMNS={columns} MEMORY_SIZE={SEGMENT_MEMORY_SIZE} bind:offsetSegmentValue={$registers.ss} bind:scrollTo followSp={true}>
    <div class="jumpToOffset-label">{$_('views.memory.jumpToOffset')}:</div>
    <input class="input" type="text" on:keyup={(e)=>scrollTo = formattedStringToInt(e.target.value, $settings.selectedFormat, 32)}>
</HexEditor>



