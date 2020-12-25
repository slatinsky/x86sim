<script>
    import {debug} from "../store/store"

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
</script>

<style>
    #screen {
        width: 560px;

        background-color: black;
        color: darkgray;
        padding: 1rem;

        font-family: monospace;
        font-size: 16px;
        text-align: left;

    }

    textarea {
        width: 100%;
        height: 250px;
    }
</style>

<div>
    <b>Obrazovka:</b><br>

    {#if $debug}
        <textarea bind:value={text}></textarea>
    {/if}

    <div id="screen">
        {#each lines as line}
            <div><span>{line}</span></div>
        {/each}
    </div>
</div>

