<script>
    import {newProject} from "../../../store/loadSave.ts";
    import Toast from "../../../components/toast";
    const toast = new Toast()

    let newProjectName = ""

    function tryToCreateNewProject() {
        if (newProjectName === "") {
            toast.error(`Názov projektu je povinný`)
        }
        else if (newProject(newProjectName)) {
            newProjectName = ""
            toast.success(`Nový projekt s názvom '${newProjectName}' úspešne vytvorený`)
        }
        else {
            toast.error(`Prosím zvoľte iný názov projektu, '${newProjectName}' už existuje`)
        }
    }
</script>

<style>
    #newProjectWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<div id="newProjectWrapper">
    <label for="newProjectName">Názov nového projektu</label>
    <input id="newProjectName" type="text" bind:value={newProjectName}>
    <button on:click={tryToCreateNewProject}><i class="fas fa-file-export"></i> Vytvoriť nový projekt</button>
    {newProjectName}
</div>

