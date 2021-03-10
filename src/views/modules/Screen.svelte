<script>
    import {settings} from "../../stores/settings";
    import { _} from 'svelte-i18n'

    let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem. '
    let maxRows = 10
    let lines = []
    $: {
        if (text) {
            let linesTemp = text.match(/[\s\S]{1,60}/g)
            if (linesTemp.length > maxRows) linesTemp.length = maxRows;
            lines = linesTemp
        }
        else {
            lines = []
        }
    }

    // how is written to screen memory using assembly: https://retrocomputing.stackexchange.com/questions/3053/how-to-write-directly-to-video-memory-in-ms-dos
</script>

<style>
    #screen {
        width: 560px;

        background-color: black;
        padding: 1rem;

        font-family: monospace;
        font-size: 16px;
        text-align: left;

    }

    #screen span {
        color: darkgray;
    }

    textarea {
        width: 100%;
        height: 250px;
    }
</style>

<div>
    <b>{$_('views.modules.screen')}:</b><br>

    {#if $settings.developerMode}
        <textarea bind:value={text}></textarea>
    {/if}

    <div id="screen">
        {#each lines as line}
            <div><span>{line}</span></div>
        {/each}
    </div>
</div>

