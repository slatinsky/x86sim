<script>
    import {defaultProjectsName} from "../../../../defaults/defaultProjects";
    import {programs, projectName} from "../../../../stores";
</script>

<p>Aby ste sa s programovaním v jazyku symbolických inštrukcií zoznámili, simulátor obsahuje krátke tutoriálové projekty, v ktorých nájdete základné informácie, ako začať</p>

{#if !$projectName.includes('tutorial')}
    <div class="alert alert-danger" role="alert">
        Aktuálne nie ste prepnutý do tutoriálového projektu. Pre začiatok tutoriálu môžete začať napríklad v projekte <a href="#" on:click={()=>programs.loadProject(defaultProjectsName)}>{defaultProjectsName}</a>
    </div>
{/if}

<p>Pre prepnutie sa do tutoriálu je potrebné si otvoriť tutoriálový projekt. V hornej navigačnej lište nájdite tlačidlo projekty:</p>
<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">

<p>A kliknite na prvý projekt začínajúci slovom "tutorial" pre jeho otvorenie</p>
<img src="assets/help/projects/opened_project.png" alt="" class="img-fluid d-block mx-auto"><br><br>

<p>Komentáre v editore kódu vás na začiatku naučia pracovať so simulátorom, neskôr vám ukážu základné konštrukcie v jazyku symbolických inštrukcií</p>
<img src="assets/help/tutorial/tutorial_code_editor.png" alt="" class="img-fluid d-block mx-auto">

<p>Ukážkový program si spúšťajte po jednej inštrukcii stláčaním tlačidla "Krok"</p>
<img src="assets/help/running_program/step_hover.png" alt="" class="img-fluid d-block mx-auto">

<!--<p>Ak v nejakej časti budete stratení, odporúčam sa vrátiť k tomuto pomocníkovi</p>-->
<!--<img src="assets/help/manual_button.png" alt="" class="img-fluid d-block mx-auto">-->

<p>Po pozretí tutoriálového projektu sa prepnite na ďalší projekt a zopakujte tieto pokyny</p>
<img src="assets/help/projects/navigation_placement.png" alt="" class="img-fluid d-block mx-auto">


<div class="alert alert-info mt-5" role="alert">
    <b>INFO: </b>Tutoriál vám postupne bude odkrývať jednotlivé moduly simulátora. Nezľaknite sa, ak sa niečo nové objaví na obrazovke :)<br>
    <img src="assets/help/tutorial/hidden_modules_in_tutorial.png" alt="" class="img-fluid d-block mx-auto">
</div>


