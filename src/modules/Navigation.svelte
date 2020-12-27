<script>
    import {projectsShown, settingsShown, helpShown, projectName} from "../store/store";
</script>

<style>
    nav {
        background-color: var(--primary-background);
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0;

        list-style-type: none;
    }
    li {
        color: var(--white-text-color);
        padding: 1rem;
        cursor: pointer;
        user-select: none;
    }
    li:hover {
        background-color: var(--active-primary-background);
    }
</style>

<nav>
    <ul>
        <li><b>{$projectName}</b></li>
        <li><i class="fas fa-step-forward"></i> Krok</li>
        <li><i class="fas fa-step-backward"></i> Krok späť</li>
        <li><i class="fas fa-play"></i> Spustiť</li>
        <li><i class="fas fa-pause"></i> Pozastaviť</li>
        <li><i class="fas fa-stop"></i> Zresetovať</li>
        <li on:click={() => $projectsShown = true}><i class="fas fa-folder-open"></i> Projekty</li>
        <li on:click={() => $settingsShown = true}><i class="fas fa-cog"></i> Nastavenia</li>
        <li on:click={() => $helpShown = true}><i class="fas fa-info-circle"></i> Pomocník</li>
    </ul>
</nav>
