<script>
    import {projectName, appState, programs} from "../../../../stores/stores";
    import Toast from "../../../components/toast";
    import {spinnerLoad} from "../../../../spinnerLoad";

    const toast = new Toast()

    let value

    // $: console.log($programs)
    $: isValueInPrograms = !$programs.filter(program => program.name === value).length


    function renameP(oldProjectName) {
        let newProjectName = prompt("Prosím zadajte nové meno projektu", oldProjectName);

        if (newProjectName != null) {
            programs.renameProject(oldProjectName, newProjectName)
            console.log("new name", newProjectName)
            toast.success(`Projekt '${oldProjectName}' premenovaný na '${newProjectName}'`)
        }
        else {
            toast.error(`Premenovanie prerušené`)
        }
    }

    function deleteP(programName) {
        programs.deleteProject(programName)
        toast.success(`Projekt '${programName}' vymazaný`)
    }

    function loadP(programName) {
        spinnerLoad(`Načítavam projekt '${programName}'`, () => {
            programs.loadProject(programName)
            toast.success(`Projekt '${programName}' načítaný`)
            $appState.projectsShown = false
        })
    }


    function createNewProject() {
        let newProjectName = prompt("Prosím zadajte meno nového projektu", "Nový projekt");
        if (newProjectName != null) {
            programs.newProject(newProjectName)
        } else {
            toast.error(`Operácia prerušená`)
        }
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
                    <div class="program text {program.name === $projectName ? 'active':''}"
                         on:click={()=>{loadP(program.name)}}>
                        <span>{program.name}</span>
                        <div>
                            {#if !(program.name === "default" && $programs.length <= 1)}
                                <span> <button class="btn btn-outline-danger btn-sm"
                                               on:click|stopPropagation={deleteP(program.name)}><i
                                        class="fas fa-trash"></i> Vymazať</button></span>
                            {/if}
                            <span><button class="btn btn-outline-primary btn-sm"
                                          on:click|stopPropagation={renameP(program.name)}><i class="fas fa-italic"></i> Premenovať</button></span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <span class="text">Žiadny projekt ešte nebol uložený - vytvorte ho</span>
    {/if}
    <button class="btn btn-outline-primary" on:click={createNewProject}>Vytvoriť nový projekt</button>
</div>
