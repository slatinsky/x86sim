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

    let inputElement
    let inputFocused = false
</script>

<style>
    .keyboardWrapper {
        position: relative;
    }

    .keyboardText {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
    }
    .keyboardText.active * {
        color: white;
    }


    img {
        width: 100%;
        filter: brightness(1.5);
    }

    img.active {
        filter: brightness(.5);
    }

    .focusableHiddenInput {
        width: 1px;
        height: 1px;
        position: absolute;
        opacity: 0;
    }
</style>

<div>
    <b>{$_('views.modules.keyboard')}
        {#if inputFocused}
            (currently active)
        {/if}
        :</b>
    <div class="keyboardWrapper">
        <div class="keyboardText {inputFocused ? 'active' : ''}">
            <input class="focusableHiddenInput" type="text" on:focus={()=>inputFocused = true} on:blur={()=>inputFocused = false}  bind:value={alwaysEmptyValue} bind:this={inputElement} on:keydown|preventDefault={keyup}>
            <p><b>Numeric:</b><br> {keycodesNumeric}&nbsp;</p>
            <p><b>Ascii:</b><br> {keycodesAscii}&nbsp;</p>
            <button class="btn btn-outline-secondary {$keycodes.length === 0 ? 'disabled' : ''}" on:click={()=> {$keycodes = []}}>Clear buffer</button>
        </div>
        <img class="{inputFocused ? 'active' : ''}" src="/keyboard.png" alt="Keyboard input" on:click={()=>inputElement.focus()}>
    </div>
</div>

