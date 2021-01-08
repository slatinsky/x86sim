<!--<script>-->
<!--    import {programs} from "../../../storeOld/storeOld";-->
<!--    import {saveProgram, loadProject, deleteProgram} from "../../../storeOld/loadSave";-->

<!--    let value-->

<!--    $: console.log($programs)-->
<!--    $: isValueInPrograms = !$programs.filter(program => program.name === value).length-->

<!--    function saveClick() {-->
<!--        console.log('saveClick')-->
<!--        saveProgram(value)-->
<!--    }-->
<!--</script>-->

<!--<div>-->
<!--    <label for="projectNameInput">Názov projektu</label>-->
<!--    <input type="text" bind:value id="projectNameInput">-->

<!--    <br>-->
<!--    <br>-->
<!--    <br>-->
<!--    <br>-->
<!--    <b>Akcie:</b><br>-->
<!--    <button class="btn btn-outline-primary"><i class="fas fa-file-export"></i> Exportovať projekt do súboru</button>-->
<!--    <button class="btn btn-outline-danger"><i class="fas fa-trash"></i> Vymazať aktuálny projekt</button>-->

<!--&lt;!&ndash;    <button on:click={saveClick}>{isValueInPrograms ? 'Uložiť' : 'Prepísať'}</button>&ndash;&gt;-->
<!--&lt;!&ndash;    <button on:click={deleteProgram(value)} disabled={isValueInPrograms}>Vymazať</button>&ndash;&gt;-->
<!--</div>-->
