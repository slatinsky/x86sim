<!--inspired by:-->
<!--https://stackoverflow.com/questions/58130227/svelte3-input-validation-->
<!--https://svelte.dev/repl/052c877eb34c45ee8f773a8bf8475347?version=3.12.1-->

<script>
    console.log("RERENDERED register")
    import {selectedFormat} from "../store/store";
    import {baseToIntWrapper, intToBaseWrapper} from "../formatConverter";

    export let bcolor = 'DARKSLATEGRAY'
    export let label = 'ax'     // register label
    let stringValue = '0000'    // value shown inside register input
    export let value = 0        // real integer value

    export let largeSquare = false

    // if register value was changes from "outside" or it was changed using "validate() - transform it to internal "stringValue"
    $: {
        stringValue = intToBaseWrapper(value, $selectedFormat)
    }

    // validate input and try to correct the format
    function validate() {
        console.log("validate")

        value = NaN                   // force rerender even if the value resolves to the same value
        value = baseToIntWrapper(stringValue, $selectedFormat, 16)
    }

    function focusIn(e) {
        if ($selectedFormat !== 'bin') {
            e.target.focus();
            e.target.setSelectionRange(0, 32);
        }
    }

    function keyUp(e) {
        if (e.key === "Enter") {
            validate()
        }
        else if (e.key === "ArrowUp") {
            value++
        }
        else if (e.key === "ArrowDown") {
            value--
        }
    }

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

    .input {
        border: none;
        outline: none;
        border-bottom: 1px solid silver;
        width: 100px;
    }

    input.bin {
        width: 160px;
    }

    input.hex {
        width: 50px;
    }

    .input:focus {
        border-bottom: 1px solid midnightblue;
    }
</style>

<div class="input-container">
    <div class="square {largeSquare ? 'large' : ''}" style="background-color: {bcolor}" data-tooltip="Všeobecný register">{label}</div>
    <input class="input {$selectedFormat}" maxlength="16" type="string" min="0" bind:value={stringValue} on:blur={validate} on:focus={focusIn} on:keyup={keyUp} />
</div>
