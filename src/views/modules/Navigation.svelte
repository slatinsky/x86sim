<script>
    import {appState, projectName, debugMode, currentlyExecutedLine} from "../../stores/stores";
    import {_, locale} from 'svelte-i18n'
    import Tooltip from "../components/Tooltip.svelte";
    import {codeRunner} from "../../compiler/codeRunner";
    import {codeRunnerStatus} from "../../compiler/codeRunner";
</script>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: var(--primary-background);
        position: sticky;
        top: 0;
        z-index: 10;
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

    @media (max-width: 1200px) {
        .navLabel {
            display: none;
        }
    }

</style>

<nav>
    <div id="navControls">
        <ul>
            <li class="notClickable">{$projectName}</li>
            <Tooltip tooltip={$_('tooltips.navigation.step')} bottom>
                <li class="{['ended', 'not-runnable'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.step()}><i class="fas fa-step-forward"></i> <span class="navLabel">{$_('views.navigation.step')}</span></li>
            </Tooltip>

            <Tooltip tooltip={$_('tooltips.navigation.stepBack')} bottom>
                <li class="{['reset', 'not-runnable'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.stepBack()}><i class="fas fa-step-backward"></i> <span class="navLabel">{$_('views.navigation.stepBack')}</span></li>
            </Tooltip>
            {#if $codeRunnerStatus === "running"}
                <Tooltip tooltip={$_('tooltips.navigation.pause')} bottom>
                    <li on:click={() => codeRunner.pause()}><i class="fas fa-pause"></i> <span class="navLabel">{$_('views.navigation.pause')}</span></li>
                </Tooltip>
            {:else}
                <Tooltip tooltip={$_('tooltips.navigation.run')} bottom>
                    <li class="{['ended', 'not-runnable'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.runForwards()}><i class="fas fa-forward"></i> <span class="navLabel">{$_('views.navigation.run')}</span></li>
                </Tooltip>
                <Tooltip tooltip={$_('tooltips.navigation.runBackwards')} bottom>
                    <li class="{['reset', 'not-runnable'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.runBackwards()}><i class="fas fa-forward fa-rotate-180"></i> <span class="navLabel">{$_('views.navigation.runBackwards')}</span></li>
                </Tooltip>
            {/if}
            <Tooltip tooltip={$_('tooltips.navigation.reset')} bottom>
                <li class="{$debugMode ? '' : 'deactivated'}" on:click={() => codeRunner.reset()}><i class="fas fa-stop"></i> <span class="navLabel">{$_('views.navigation.reset')}</span></li>
            </Tooltip>
        </ul>
    </div>
    <div id="navInfo">
        <ul>
            <Tooltip tooltip={$_('tooltips.navigation.projects')} bottom>
                <li on:click={() => $appState.projectsShown = true}><i class="fas fa-folder-open"></i> <span class="navLabel">{$_('views.navigation.projects')}</span></li>
            </Tooltip>
            <Tooltip tooltip={$_('tooltips.navigation.settings')} bottom>
                <li on:click={() => $appState.settingsShown = true}><i class="fas fa-cog"></i> <span class="navLabel">{$_('views.navigation.settings')}</span></li>
            </Tooltip>
            <Tooltip tooltip={$_('tooltips.navigation.help')} bottom>
                <li on:click={() => $appState.helpShown = true}><i class="fas fa-info-circle"></i> <span class="navLabel">{$_('views.navigation.help')}</span></li>
            </Tooltip>
            <Tooltip tooltip="English" bottom>
                <li on:click={() => $locale = 'en'}>EN</li>
            </Tooltip>
            <Tooltip tooltip="Slovensky" left>
                <li on:click={() => $locale = 'sk'}>SK</li>
            </Tooltip>





        </ul>
    </div>
</nav>

{#if $debugMode}
    <Tooltip tooltip={$_('tooltips.navigation.debugMode')} right>
        <p>{$_('views.navigation.debugMode')} <i class="fas fa-question-circle"></i></p>
    </Tooltip>
{:else}
    <p>&nbsp;</p>
{/if}
