<script>
    import {appState, projectName, debugMode, currentlyExecutedLine, programIsRunning} from "../../stores/stores";
    import {compiler} from "../../compiler/compiler";
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

    li.deactivated,
    li.deactivated:hover  {
        color: var(--white-deactivated-text-color);
        pointer-events: none;
    }

    p {
        padding: .1rem 1rem;
        margin: 0;
        color: gray;
        user-select: none;
    }
</style>

<nav>
    <div id="navControls">
        <ul>
            <li class="notClickable">{$projectName}</li>
            <li class="{$currentlyExecutedLine === -1 ? 'deactivated' : ''}" on:click={() => compiler.step()}><i class="fas fa-step-forward"></i> Krok</li>
            <li class="{$debugMode ? '' : 'deactivated'}" on:click={() => compiler.stepBack()}><i class="fas fa-step-backward"></i> Krok späť</li>
            {#if $programIsRunning}
                <li on:click={() => compiler.pause()}><i class="fas fa-pause"></i> Pozastaviť</li>
            {:else}
                <li class="{$currentlyExecutedLine === -1 ? 'deactivated' : ''}" on:click={() => compiler.run()}><i class="fas fa-play"></i> Spustiť</li>
            {/if}
            <li class="{$debugMode ? '' : 'deactivated'}" on:click={() => compiler.reset()}><i class="fas fa-stop"></i> Zresetovať</li>
        </ul>
    </div>
    <div id="navInfo">
        <ul>
            <li class="{$debugMode ? 'deactivated' : ''}" on:click={() => $appState.projectsShown = true}><i class="fas fa-folder-open"></i> Projekty</li>
            <li on:click={() => $appState.settingsShown = true}><i class="fas fa-cog"></i> Nastavenia</li>
            <li on:click={() => $appState.helpShown = true}><i class="fas fa-info-circle"></i> Pomocník</li>
        </ul>
    </div>
</nav>

{#if $debugMode}
    <p>REŽIM LADENIA: automatické ukladanie je počas ladenia vypnuté. Do klasického režimu sa vrátite stlačením tlačidla "Zresetovať", po ktorom bude obsah registrov a pamäte vrátený naspäť</p>
{:else}
    <p>&nbsp;</p>
{/if}
