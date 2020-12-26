<script>
    import {programs} from "./store";
    import {saveProgram, loadProgram, deleteProgram} from "./loadSave";

    let value

    $: console.log($programs)
    $: isValueInPrograms = !$programs.filter(program => program.name === value).length

    function saveClick() {
        console.log('saveClick')
        saveProgram(value)
    }
</script>

<style>
    #main {
        padding: 2rem;
    }
    #main > div {
        margin: 1.5rem 0;
    }
    #programList {
        border-bottom: solid lightgray 1px;
    }

    .program {
        cursor: pointer;
        padding: .5rem 1rem;
        border-top: solid lightgray 1px;
    }

    .program:hover {
        background-color: lightgray;
    }
</style>


<div id="main">
    <h3>Projekty</h3>
    <div>
        <div><b>Projekty:</b></div>
        <label for="projectNameInput">Meno projektu</label>
        <input type="text" bind:value id="projectNameInput">

        <button on:click={saveClick}>{isValueInPrograms ? 'Uložiť' : 'Prepísať'}</button>
        <button on:click={deleteProgram(value)} disabled={isValueInPrograms}>Vymazať</button>
    </div>


    {#if $programs.length > 0}
        <div>
            <b>Posledne uložené projekty:</b>
            <div id="programList">
                {#each $programs as program}
                    <div class="program" on:click={()=>{loadProgram(program.name); value=program.name}}>
                        <span>{program.name}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>



