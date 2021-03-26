<script>
    import {_} from "svelte-i18n";
    import HexEditor from "./HexEditor.svelte";
    import {onMount} from "svelte";
    import {registers} from "../../stores/registers";
    let columns = 2
    let scrollTo = 0

    onMount(async()=> {
        const unsubscribe = registers.subscribe(newRegisters => {
            scrollTo = (newRegisters.ss << 4) + newRegisters.sp
        });
    })
</script>

<b>{$_('views.modules.stack')}:</b><br>
<HexEditor COLUMNS={columns} bind:scrollTo>
    {$_('views.memory.jumpToOffset')}:<br><input type="text" on:keyup={(e)=>scrollTo = e.target.value}>
</HexEditor>



