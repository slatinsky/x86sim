<script>
    import {settings} from "../../stores/settings";
    import {baseToIntWrapper, intToBaseWrapper} from "../../formatConverter";
    export let bits = 16  // how many bits can value hold

    let stringValue = '0000'    // value shown inside register input
    export let value = 0        // real integer value
    export let tooltip = ""
    export let largeSquare = false
    let focused = false

    // if register value was changes from "outside" or it was changed using "validate() - transform it to internal "stringValue"
    function updateStringValue(value) {
        stringValue = intToBaseWrapper(value, $settings.selectedFormat)
    }

    $: {
        if (!focused) {
            // Comma operator (,) - calls updateStringValue only if store changed https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
            $settings.selectedFormat, updateStringValue(value)
        }
    }

    // validate input and try to correct the format
    function validate() {
        console.log("validate", value)

        value = NaN                   // force rerender even if the value resolves to the same value
        value = baseToIntWrapper(stringValue, $settings.selectedFormat, bits)
        focused = false
    }

    function focusIn(e) {
        if ($settings.selectedFormat !== 'bin') {
            e.target.focus();
            e.target.setSelectionRange(0, 32);
        }
        focused = true
    }

    function keyUp(e) {
        console.log("keyUp")
        if (e.key === "Enter") {
            validate()
        } else if (e.key === "ArrowUp") {
            value++
            updateStringValue(value)
        } else if (e.key === "ArrowDown") {
            value--
            updateStringValue(value)
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

    .input {
        width: 100px;
    }

    input.bin {
        width: 160px;
    }

    input.hex {
        width: 50px;
    }
</style>

<input class="input {$settings.selectedFormat}" maxlength="16" type="string" min="0" bind:value={stringValue} on:blur={validate} on:focus={focusIn} on:keyup={keyUp} />

{value}
