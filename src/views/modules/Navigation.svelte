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
            <Tooltip tooltip={$_('tooltips.navigation.step')} bottom>
                <li class="{$codeRunnerStatus === 'ended' ? 'deactivated' : ''}" on:click={() => codeRunner.step()}><i class="fas fa-step-forward"></i> {$_('views.navigation.step')}</li>
            </Tooltip>

            <Tooltip tooltip={$_('tooltips.navigation.stepBack')} bottom>
                <li class="{$codeRunnerStatus === 'stopped' ? '' : ''}" on:click={() => codeRunner.stepBack()}><i class="fas fa-step-backward"></i> {$_('views.navigation.stepBack')}</li>
            </Tooltip>
            {#if $codeRunnerStatus === "running"}
                <Tooltip tooltip={$_('tooltips.navigation.pause')} bottom>
                    <li on:click={() => codeRunner.pause()}><i class="fas fa-pause"></i> {$_('views.navigation.pause')}</li>
                </Tooltip>
            {:else}
                <Tooltip tooltip={$_('tooltips.navigation.run')} bottom>
                    <li class="{['stopped', 'paused'].includes($codeRunnerStatus) ? 'deactivated' : ''}" on:click={() => codeRunner.run()}><i class="fas fa-play"></i> {$_('views.navigation.run')}</li>
                </Tooltip>
            {/if}
            <Tooltip tooltip={$_('tooltips.navigation.reset')} bottom>
                <li class="{$debugMode ? '' : 'deactivated'}" on:click={() => codeRunner.reset()}><i class="fas fa-stop"></i> {$_('views.navigation.reset')}</li>
            </Tooltip>
        </ul>
    </div>
    <div id="navInfo">
        <ul>
            <Tooltip tooltip={$_('tooltips.navigation.projects')} bottom>
                <li class="{$debugMode ? 'deactivated' : ''}" on:click={() => $appState.projectsShown = true}><i class="fas fa-folder-open"></i> {$_('views.navigation.projects')}</li>
            </Tooltip>
            <Tooltip tooltip={$_('tooltips.navigation.settings')} bottom>
                <li on:click={() => $appState.settingsShown = true}><i class="fas fa-cog"></i> {$_('views.navigation.settings')}</li>
            </Tooltip>
            <Tooltip tooltip={$_('tooltips.navigation.help')} bottom>
                <li on:click={() => $appState.helpShown = true}><i class="fas fa-info-circle"></i> {$_('views.navigation.help')}</li>
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
    <p>REŽIM LADENIA: automatické ukladanie je počas ladenia vypnuté. Do klasického režimu sa vrátite stlačením tlačidla "Zresetovať", po ktorom bude obsah registrov a pamäte vrátený naspäť</p>
{:else}
    <p>&nbsp;</p>
{/if}
