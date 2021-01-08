<script>
    import {tick} from "svelte"
    import {programs, projectsShown, projectName, loadingReason} from "../../../../store/store";
    import {loadProject, deleteProject, newProject} from "../../../../store/loadSave";
    import Toast from "../../../components/toast";
    const toast = new Toast()

    let value

    $: console.log($programs)
    $: isValueInPrograms = !$programs.filter(program => program.name === value).length


    function renameProject(name) {
        console.log(name)
    }

    function deleteP(programName) {
        deleteProject(programName)
        toast.success(`Projekt '${programName}' vymazaný`)
    }
    function loadP(programName) {
        $loadingReason = `Načítavam projekt '${programName}'`
        setTimeout(()=> {
            loadProject(programName)
            toast.success(`Projekt '${programName}' načítaný`)
            $loadingReason = ""
        }, 10)
    }

</script>

<style>
    #main {
        /*padding: 2rem;*/
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

        display: flex;
        justify-content: space-between;
    }

    .program:hover,
    .program.active {
        background-color: var(--active-secondary-background);
    }
</style>


<div id="main">
    <p>Otvorený projekt je automaticky ukladaný</p>


    {#if $programs.length > 0}
        <div>
            <div id="programList">

                {#each $programs as program}
                    <div class="program text {program.name === $projectName ? 'active':''}" on:click={()=>{loadP(program.name)}}>
                        <span>{program.name}</span>
                        <div>
                            {#if program.name !== $projectName}
                                <span> <button class="btn btn-outline-danger btn-sm" on:click|stopPropagation={deleteP(program.name)}><i class="fas fa-trash"></i> Vymazať</button></span>
                            {/if}
                            <span><button class="btn btn-outline-primary btn-sm" on:click|stopPropagation={renameProject(program.name)}><i class="fas fa-italic"></i> Premenovať</button></span>
                        </div>



                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <span class="text">Žiadny projekt ešte nebol uložený - vytvorte ho</span>
    {/if}
</div>
