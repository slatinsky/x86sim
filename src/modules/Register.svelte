<!--inspired by:-->
<!--https://stackoverflow.com/questions/58130227/svelte3-input-validation-->
<!--https://svelte.dev/repl/052c877eb34c45ee8f773a8bf8475347?version=3.12.1-->

<script>
    import {selectedFormat} from "../registersStore";

    let color = 'DARKSLATEGRAY'
    export let label = 'ax'     // register label
    let stringValue = '0000'    // value shown inside register input
    export let value = 0        // real integer value

    // if register value was changes from "outside" or it was changed using "validate() - transform it to internal "stringValue"
    $: {
        if ($selectedFormat === 'hex') {
            stringValue = value.toString(16).padStart(4, '0')
        } else if ($selectedFormat === 'signed' || $selectedFormat === 'unsigned') {
            stringValue = value
        } else if ($selectedFormat === 'bin') {
            stringValue = value.toString(2).padStart(16, '0')
        }
    }

    // validate input and transfer
    function validate() {
        console.log("validate")

        let oldValue = stringValue
        let newValue = oldValue



        if ($selectedFormat === 'bin') {
            // remove characters other than numbers and a-f
            newValue = newValue.replaceAll(/[^0-1]/gm, '')

            // remove zeros from the beginning
            newValue = newValue.replaceAll(/^0+/gm, '')

            // allow only 16 characters
            newValue = newValue.substring(0, 16)

            // if not all 16 characters, pad with zeros
            newValue = newValue.padStart(16, '0')

            if (newValue.length === 0) {
                newValue = '0'
            }

            value = NaN                   // force rerender even if the value resolves to the same value
            value = parseInt(newValue, 2)
            console.log("value", value)
        }
        else if ($selectedFormat === 'hex') {
            // convert to lowercase
            newValue = newValue.toLowerCase()

            // remove characters other than numbers and a-f
            newValue = newValue.replaceAll(/[^0-9a-f]/gm, '')

            // remove zeros from the beginning
            newValue = newValue.replaceAll(/^0+/gm, '')

            // allow only 4 characters
            newValue = newValue.substring(0, 4)

            // if not all 4 characters, pad with zeros
            newValue = newValue.padStart(4, '0')

            if (newValue.length === 0) {
                newValue = '0'
            }

            value = NaN                   // force rerender even if the value resolves to the same value
            value = parseInt(newValue, 16)
            console.log("value", value)
        }
        else if ($selectedFormat === 'signed' || $selectedFormat === 'unsigned') {
            // remove characters other than numbers
            newValue = newValue.replaceAll(/[^0-9]/gm, '')

            // remove zeros from the beginning
            newValue = newValue.replaceAll(/^0+/gm, '')

            if (newValue.length === 0) {
                newValue = '0'
            }
            value = NaN                   // force rerender even if the value resolves to same value
            value = parseInt(newValue, 10)
        }
    }

    function focusIn(e) {
        if ($selectedFormat !== 'bin') {
            e.target.focus();
            e.target.setSelectionRange(0, 32);
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

<div class='input-container'>
    <div class='square' style="background-color: {color}" data-tooltip="Všeobecný register">{label}</div>
    <input class="input {$selectedFormat}" type="string" min="0" bind:value={stringValue} on:blur={validate} on:focus={focusIn}  />
</div>
