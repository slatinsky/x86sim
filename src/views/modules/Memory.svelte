<script>
    import {memory} from "../../stores/stores";
</script>

<div>
    <b>Pamäť:</b>
    {#each $memory as memoryCell}
        <div>{memoryCell}</div>
    {/each}
</div>
<button on:click={memory.reset}>Zresetovať pamäť</button>
<button on:click={()=>memory.set(0, 50)}>Nastav na adrese 0 hodnotu 50</button>
<button on:click={()=>console.log(memory.reduce())}>Vypíš redukovaný objekt</button>

