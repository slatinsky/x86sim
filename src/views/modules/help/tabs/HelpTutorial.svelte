<script>
    import {defaultProjectsName} from "../../../../defaults/defaultProjects";
    import {programs, projectName} from "../../../../stores/stores";
</script>

<p>Aby ste sa s programovaním v jazyku symbolických inštrukcií zoznámili, pripravil som si pre vás krátky tutoriál</p>

{#if !$projectName.includes('tutorial')}
    <div class="alert alert-danger" role="alert">
        Aktuálne nie ste prepnutý do tutoriálového projektu. Pre začiatok tutoriálu môžete začať napríklad v projekte <a href="#" on:click={()=>programs.loadProject(defaultProjectsName)}>{defaultProjectsName}</a>
    </div>
{/if}

<p>Pred začatím odporúčam pozrieť v pomocníkovi časť "Krokovanie programu"</p>
<p>Ďalej pokračujete podľa pokynov v editore kódu</p>
<p>Pre prejdenie na ďalší tutoriál iba zmeníte aktuálne otvorený projekt</p>
