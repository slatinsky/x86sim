<script>
    let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus turpis in eu mi bibendum neque. Congue quisque egestas diam in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Orci sagittis eu volutpat odio facilisis mauris sit. Magna etiam tempor orci eu. Fames ac turpis egestas sed. Mi quis hendrerit dolor magna eget est lorem. '
    $: lines = text.match(/[\s\S]{1,60}/g);
</script>

<style>
    #screen {
        width: 560px;

        background-color: black;
        color: white;
        padding: 1rem;

        font-family: monospace;
        font-size: 16px;
        text-align: left;

    }
</style>

<div>
    <b>Obrazovka:</b>

    <div id="screen">

        {#each lines as line}
            <div><span>{line}</span></div>
        {/each}
    </div>
</div>

