<!--inspired by:-->
<!--https://stackoverflow.com/questions/58130227/svelte3-input-validation-->
<!--https://svelte.dev/repl/052c877eb34c45ee8f773a8bf8475347?version=3.12.1-->

<script>
    import Tooltip from "../components/Tooltip.svelte";
    import FormatInput from "../components/FormatInput.svelte";

    export let value = 0        // real integer value
    export let bits
    export let isDifferent = false

    // square styling
    export let bcolor = 'darkslategray'
    export let label            // register label
    export let tooltip = ""
    export let largeSquare = false
</script>

<style>
    .input-container {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }

    .square {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: .4rem;
        border-radius: .25rem;
        color: white;
        text-align: center;
    }

    .square.large {
        width: 3rem;
    }
</style>

<div class="input-container">
    <Tooltip {tooltip} bottom>
        <div class="square {largeSquare ? 'large' : ''}" style="background-color: {bcolor}" data-tooltip="Všeobecný register">{label}</div>
    </Tooltip>
    <FormatInput bind:value={value} {bits} {isDifferent} />
</div>
