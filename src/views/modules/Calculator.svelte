<script>
    import {formattedStringToInt} from "../../formatConverter";
    import {intToFormattedString} from "../../formatConverter";
    import {_} from "svelte-i18n";

let signedValue = 10
let bits = 16
$: unsignedValue = intToFormattedString(signedValue, 'unsigned', bits)
$: binValue = intToFormattedString(signedValue, 'bin', bits)
$: hexValue = intToFormattedString(signedValue, 'hex', bits)
</script>


<div>
    <b>{$_('views.modules.calculator')}:</b><br>
    <div>
        <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" id="calc-8-bit-radio" autocomplete="off" value={8} bind:group={bits}>
            <label class="btn btn-outline-success" for="calc-8-bit-radio">8-bit</label>

            <input type="radio" class="btn-check" id="calc-16-bit-radio" autocomplete="off" value={16} bind:group={bits}>
            <label class="btn btn-outline-success" for="calc-16-bit-radio">16-bit</label>

            <input type="radio" class="btn-check" id="calc-32-bit-radio" autocomplete="off" value={32} bind:group={bits}>
            <label class="btn btn-outline-success" for="calc-32-bit-radio">32-bit</label>
        </div>
    </div>
    <div>
        <label for="calc-dec">Signed dec</label>
        <input id="calc-dec" type="text" bind:value={signedValue}>
    </div>
    <div>
        <label for="calc-unsigned">Unsigned dec</label>
        <input id="calc-unsigned" type="text" bind:value={unsignedValue} on:keyup={e => signedValue = formattedStringToInt(e.target.value, 'unsigned', bits)}>
    </div>
    <div>
        <label for="calc-hex">Hex</label>
        <input id="calc-hex" type="text" bind:value={hexValue} on:keyup={e => signedValue = formattedStringToInt(e.target.value, 'hex', bits)}>
    </div>
    <div>
        <label for="calc-bin">Bin</label>
        <input id="calc-bin" type="text" bind:value={binValue} on:keyup={e => signedValue = formattedStringToInt(e.target.value, 'bin', bits)}>
    </div>
</div>


