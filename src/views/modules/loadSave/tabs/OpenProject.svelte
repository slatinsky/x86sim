<script>
    import {projectName, appState, programs} from "../../../../stores/stores";
    import Toast from "../../../components/toast";
    import {spinnerLoad} from "../../../../spinnerLoad";
    import { _} from 'svelte-i18n'

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

    function downloadP(projectNameToSave) {
        programs.downloadProject(projectNameToSave)
    }


    // drag and drop
    // modified from http://html5demos.com/file-api and https://stackoverflow.com/questions/11313414/html5-drag-and-drop-load-text-file-in-a-textbox-with-javascript
    let holder = document.getElementById('holder')
    document.ondragover = function() {  // prevent default
        this.className = 'hover';
        return false;
    };
    document.ondragend = function() {
        this.className = '';
        return false;
    };
    document.ondrop = function(e) {
        this.className = '';
        e.preventDefault();
        let lastItemIndex = Object.keys(e.dataTransfer.files).length - 1
        let i = 0


        for (const file of Object.values(e.dataTransfer.files)) {  // supports multiple files drag and drop
            let reader = new FileReader()
            reader.onload = function(event) {
                let isLast = lastItemIndex === i
                i++
                programs.uploadProject(event.target.result, isLast)

            };
            reader.readAsText(file);


        }
        return false;
    };

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

    #holder {
        border: 2px dashed #bbb;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        padding: 50px;
        text-align: center;
        font: 21pt bold;
        color: #bbb;
    }
</style>


<div id="main">
    <p>{$_('views.projects.openedProjectAutosaveInfo')}</p>


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
                                        class="fas fa-trash"></i> {$_('views.projects.delete')}</button></span>
                            {/if}
                            <span><button class="btn btn-outline-primary btn-sm" on:click|stopPropagation={renameP(program.name)}><i class="fas fa-italic"></i> {$_('views.projects.rename')}</button></span>
                            <span><button class="btn btn-outline-secondary btn-sm" on:click|stopPropagation={downloadP(program.name)}><i class="fas fa-file-download"></i> {$_('views.projects.download')}</button></span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <span class="text">No project exists, weird</span>
    {/if}
    <button class="btn btn-outline-primary" on:click={createNewProject}>{$_('views.projects.new')}</button>

    <div id="holder" class="mb-3" >{$_('views.projects.upload')}</div>

</div>
