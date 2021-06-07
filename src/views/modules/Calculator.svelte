<script>
import {_} from "svelte-i18n";
import {BitNumber} from "../../number";

let bitNumber = new BitNumber()


let bits = 16
let signedValue = 0
let unsignedValue = 0
let binValue = 0
let hexValue = 0

function recalculate() {
    $: signedValue = bitNumber.signed
    $: unsignedValue = bitNumber.unsigned
    $: binValue = bitNumber.bin
    $: hexValue = bitNumber.hex
}

$: {
    let oldValue = bitNumber.signed
    bitNumber = new BitNumber(bits).setSigned(oldValue)
    recalculate()
}
</script>

<style>
    label {
        width: 150px;
    }
</style>

<div>
    <b>{$_('views.modules.calculator')}:</b><br>
    <div class="pb-2">
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
        <input id="calc-dec" class="input" type="text" bind:value={signedValue} on:keyup={e => bitNumber = bitNumber.setSigned(e.target.value)}>
    </div>
    <div>
        <label for="calc-unsigned">Unsigned dec</label>
        <input id="calc-unsigned" class="input" type="text" bind:value={unsignedValue} on:keyup={e => bitNumber = bitNumber.setUnsigned(e.target.value)}>
    </div>
    <div>
        <label for="calc-hex">Hex</label>
        <input id="calc-hex" class="input" type="text" bind:value={hexValue} on:keyup={e => bitNumber = bitNumber.setHex(e.target.value)}>
    </div>
    <div>
        <label for="calc-bin">Bin</label>
        <input id="calc-bin" class="input" type="text" bind:value={binValue} on:keyup={e => bitNumber = bitNumber.setBin(e.target.value)}>
    </div>
</div>


