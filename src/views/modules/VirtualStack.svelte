<script>
    import {_} from "svelte-i18n";
    import HexEditor from "./HexEditor.svelte";
    let columns = 2
    let scrollTo
</script>

<b>{$_('views.modules.stack')}:</b><br>
<HexEditor COLUMNS={columns} bind:scrollTo followSp={true}>
    {$_('views.memory.jumpToOffset')}:<br><input type="text" on:keyup={(e)=>scrollTo = e.target.value}>
</HexEditor>



