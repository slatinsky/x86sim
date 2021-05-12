<script>
    import {appState, projectName, debugMode, currentlyExecutedLine} from "../../stores/stores";
    import {_, locale} from 'svelte-i18n'
    import Tooltip from "../components/Tooltip.svelte";
    import {codeRunner} from "../../compiler/codeRunner";
    import {codeRunnerStatus} from "../../compiler/codeRunner";
    import QuestionCircle from "../components/QuestionCircle.svelte";
    import IconUnitedKingdom from "../../assets/icons/united-kingdom.svg";
    import IconSlovakia from "../../assets/icons/slovakia.svg";
    import {language} from "../../stores/language";
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

    .icon {
        width: 20px;
        height: 20px;
    }

</style>

<nav>
    <div id="navControls">
        <ul>
            <li class="notClickable">{$projectName}</li>
            <Tooltip tooltip={$_('tooltips.navigation.step')} bottom>
                <li class="{['ended', 'not-runnable', 'running'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.step()}><i class="fas fa-step-forward"></i> <span class="navLabel">{$_('views.navigation.step')}</span></li>
            </Tooltip>

            <Tooltip tooltip={$_('tooltips.navigation.stepBack')} bottom>
                <li class="{['reset', 'not-runnable', 'running'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.stepBack()}><i class="fas fa-step-backward"></i> <span class="navLabel">{$_('views.navigation.stepBack')}</span></li>
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
                <li on:click={() => $language = 'en'}><div class="icon"><IconUnitedKingdom /></div></li>
            </Tooltip>
            <Tooltip tooltip="Slovensky" left>
                <li on:click={() => $language = 'sk'}><div class="icon"><IconSlovakia /></div></li>
            </Tooltip>





        </ul>
    </div>
</nav>

{#if $debugMode}
    <p>{$_('views.navigation.debugMode')} <QuestionCircle tooltip={$_('tooltips.navigation.debugMode')} /></p>
{:else}
    <p>&nbsp;</p>
{/if}
