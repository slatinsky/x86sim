<script>
    import {formattedStringToInt, intToFormattedString, splitSelectedFormat} from "../../formatConverter";
    import {settings} from "../../stores";
    export let bits             // how many bits can value hold

    let stringValue = '0'        // value shown inside register input
    export let value = 0        // signed integer value
    let focused = false         // is element currently focused?
    export let isDifferent = false

    // if register value was changes from "outside" or it was changed using "validate() - transform it to internal "stringValue"
    function updateStringValue() {
        stringValue = intToFormattedString(value, $settings.selectedFormat, parseInt(bits))
    }

    // try to correct the format of input after losing focus
    $: {
        if (!focused) {
            // Comma operator (,) - calls updateStringValue only if store changed https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
            $settings.selectedFormat, updateStringValue(value)
        }
    }

    $: stringValue, updateValue()

    // tries to parse signed integer from value
    function updateValue() {
        value = NaN                 // force rerender even if the value resolves to the same value
        value = formattedStringToInt(stringValue, $settings.selectedFormat, parseInt(bits))
        // console.log("new value", value, stringValue)
    }

    function focusIn(e) {
        if ($settings.selectedFormat !== 'bin') {
            e.target.focus();
            e.target.setSelectionRange(0, 32);      // after focus, automatically select all text inside
        }
        focused = true
    }
    function focusOut(e) {
        focused = false
        updateStringValue(value)  // try to correct the format of input after losing focus
    }

    function keyUp(e) {
        console.log("keyUp")
        if (e.key === "Enter") {
            updateStringValue(value)
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
    .input {
        width: 100px;
    }

    input.bin {
        width: 160px;
    }

    input.hex {
        width: 50px;
    }

    input.boolean {
        width: 20px;
    }

    input.isDifferent {
        color: var(--changed-value);
    }
</style>

<input class="input {$settings.selectedFormat} {parseInt(bits) === 1 ? 'boolean' : ''} {isDifferent ? 'isDifferent' : ''}" maxlength="16" type="string" bind:value={stringValue} on:blur={focusOut} on:focus={focusIn} on:keyup={keyUp} />

<!--{value}-->
