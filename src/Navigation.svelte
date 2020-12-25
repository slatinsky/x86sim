<script>
    import {projectsShown, settingsShown} from "./store/store";
</script>

<style>
    nav {
        background-color: midnightblue;
    }

    ul {
        display: flex;
        flex-wrap: wrap;

        list-style-type: none;
    }
    li {
        color: white;
        padding: 1rem;
        cursor: pointer;
        user-select: none;
    }
    li:hover {
        background-color: dodgerblue;
    }
</style>

<nav>
    <ul>
        <li><i class="fas fa-step-forward"></i> Krok</li>
        <li><i class="fas fa-step-backward"></i> Krok späť</li>
        <li><i class="fas fa-play"></i> Spustiť</li>
        <li><i class="fas fa-pause"></i> Pozastaviť</li>
        <li><i class="fas fa-stop"></i> Zresetovať</li>
        <li on:click={() => $projectsShown = true}><i class="fas fa-folder-open"></i> Projekty</li>
        <li on:click={() => $settingsShown = true}><i class="fas fa-cog"></i> Nastavenia</li>
    </ul>
</nav>
