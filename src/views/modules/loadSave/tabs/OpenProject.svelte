<script>
    import {projectName, appState, programs, debugMode} from "../../../../stores/stores";
    import {spinnerLoad} from "../../../../spinnerLoad";
    import { _} from 'svelte-i18n'
    import {codeRunner} from "../../../../compiler/codeRunner";
    import {toastQueue} from "../../../../stores/toastQueue";



    let value

    // $: console.log($programs)
    $: isValueInPrograms = !$programs.filter(program => program.name === value).length

    function renameP(oldProjectName) {
        let newProjectName = prompt($_('views.projects.prompts.newProject'), oldProjectName);

        if (newProjectName != null) {
            programs.renameProject(oldProjectName, newProjectName)
            console.log("new name", newProjectName)
            toastQueue.success($_('views.projects.toasts.renamed', {values: {oldProjectName, newProjectName}}))
        }
        else {
            toastQueue.error($_('views.projects.toasts.renameCanceled'))
        }
    }

    function deleteP(programName) {
        programs.deleteProject(programName)
        toastQueue.success($_('views.projects.toasts.deleted', {values: {programName}}))
    }

    function loadP(programName) {
        spinnerLoad($_('views.projects.toasts.loading', {values: {programName}}), () => {
            programs.loadProject(programName)
            toastQueue.success($_('views.projects.toasts.loaded', {values: {programName}}))
            $appState.projectsShown = false
        })
    }


    function createNewProject() {
        let newProjectName = prompt($_('views.projects.prompts.newProject'), $_('views.projects.prompts.newProjectDefault'));
        if (newProjectName != null) {
            programs.newProject(newProjectName)
        } else {
            toastQueue.error($_('views.projects.toasts.canceled'))
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
                programs.uploadProject(event.target.result, file, isLast)

            };
            reader.readAsText(file);


        }
        return false;
    };

    function downloadAllProjects() {
        programs.downloadAllProjects()
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

    #holder {
        border: 2px dashed #bbb;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        padding: 50px;
        text-align: center;
        font-size: 21pt;
        color: #bbb;
    }
</style>


<div id="main">
    <p>{$_('views.projects.openedProjectAutosaveInfo')}</p>

    {#if $debugMode}
        <div class="alert alert-danger" role="alert">
            {$_('views.projects.unsavedChangesAlert1')}
            <a href="javascript:void(0)" on:click={() => codeRunner.reset()}>{$_('views.projects.unsavedChangesAlert2')}</a>
        </div>
    {/if}


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
        <span class="text">No project exists, weird</span> <!-- User should never see this message -->
    {/if}
    <button class="btn btn-outline-primary" on:click={createNewProject}><i class="fas fa-plus"></i> {$_('views.projects.new')}</button><button class="btn btn-outline-secondary ms-2" on:click|stopPropagation={()=>downloadAllProjects()}><i class="fas fa-file-download"></i> {$_('views.projects.downloadAll')}</button>

    <div id="holder">{$_('views.projects.upload')}</div>
    <br>  <!--  temporary permanent solution to add bottom margin -->
</div>
