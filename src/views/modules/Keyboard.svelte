<script>
    import { _} from 'svelte-i18n'
    import {keyCodesToKeyNames} from "../../config";
    import {keycodes} from "../../stores/stores";
    let alwaysEmptyValue = ""
    $: alwaysEmptyValue, alwaysEmptyValue = ""

    $: keycodesNumeric = keycodesToNumeric($keycodes)
    $: keycodesAscii = keycodesToAscii($keycodes)

    function keyup(e) {
        // console.log(e)
        // if (e.key.length === 1 || e.key === "Space") {  // some keys, for example "Shift" have multiple characters. We want only simple keys
        //     keycodes.push(e.key.charCodeAt(0))  // ascii to key number
        //     keycodes = keycodes
        // }

        $keycodes.push(e.keyCode)
        $keycodes = $keycodes
    }

    function keycodesToNumeric(keycodes) {
        return keycodes.join(' ')
    }
    function keycodesToAscii(keycodes) {
        return keycodes.map(keycode => {
            if (keycode in keyCodesToKeyNames) {
                return keyCodesToKeyNames[keycode]
            }
            else {
                return String.fromCharCode(keycode)
            }
        }).join(' ')
    }
</script>

<div>
    <b>{$_('views.modules.keyboard')}:</b>

    <input type="text" bind:value={alwaysEmptyValue} on:keydown|preventDefault={keyup}>
    <button on:click={()=>$keycodes = []}>Clear buffer</button>
    <p><b>Numeric:</b><br> {keycodesNumeric}</p>
    <p><b>Ascii:</b><br> {keycodesAscii}</p>
    <p>{JSON.stringify($keycodes)}</p>
</div>

