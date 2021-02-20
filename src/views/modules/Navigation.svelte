<script>
    import {appState} from "../../stores/stores";
    import {projectName} from "../../stores/stores";
    import {spinnerLoad} from "../../spinnerLoad";
    import {runAll} from "../../compiler/mainLogic";
    import {code} from "../../stores/stores";
</script>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
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
    li:not(.notClickable):hover {
        background-color: var(--active-primary-background);
    }

    li.notClickable {
        font-weight: bold;
        cursor: default;
    }
</style>

<nav>
    <div id="navControls">
        <ul>
            <li class="notClickable">{$projectName}</li>
            <li><i class="fas fa-step-forward"></i> Krok</li>
            <li><i class="fas fa-step-backward"></i> Krok späť</li>
            <li on:click={() => runAll($code)}><i class="fas fa-play"></i> Spustiť</li>
            <li on:click={()=>clearInterval(window.runningProcess)}><i class="fas fa-pause"></i> Pozastaviť</li>
            <li><i class="fas fa-stop"></i> Zresetovať</li>
        </ul>
    </div>
    <div id="navInfo">
        <ul>
            <li on:click={() => $appState.projectsShown = true}><i class="fas fa-folder-open"></i> Projekty</li>
            <li on:click={() => $appState.settingsShown = true}><i class="fas fa-cog"></i> Nastavenia</li>
            <li on:click={() => $appState.helpShown = true}><i class="fas fa-info-circle"></i> Pomocník</li>
        </ul>
    </div>

</nav>
