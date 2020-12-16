<script>
    // https://stackoverflow.com/questions/58130227/svelte3-input-validation
    // https://svelte.dev/repl/052c877eb34c45ee8f773a8bf8475347?version=3.12.1
    let total = 100;
    let inputs = [{
        name: 'ax',
        value: '0000',
        convertedValue: 0,
        color: 'GRAY'
    }, {
        name: 'bx',
        value: '0000',
        convertedValue: 0,
        color: 'DARKSLATEGRAY'
    }, {
        name: 'cx',
        value: '0000',
        convertedValue: 0,
        color: 'TEAL'
    }];

    let formats = [
        { id: 1, text: `16-ková sústava` },
        { id: 2, text: `10-ková sústava (unsigned)` },
        { id: 3, text: `10-ková sústava (signed)` }
    ];

    let selectedFormat = 1
    $: console.log("selectedFormat", selectedFormat)

    function validate(index) {
        let oldValue = inputs[index].value
        let newValue = oldValue

        console.log(typeof inputs[index].value, inputs[index].value)

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

        // if value was changed during validation, apply it
        if (oldValue !== newValue) {
            inputs[index].value = newValue;
        }

        inputs[index].convertedValue = parseInt(newValue, 16)
        console.log("inputs[index].convertedValue", inputs[index].convertedValue)
    }

    function validateApply(index) {
        validate(index)
    }

    function focusIn(e) {
        e.target.focus();
        e.target.setSelectionRange(0, 4);
        console.log(e)
    }

    $: inputsJSON = JSON.stringify(inputs, null, 2)

</script>

<style>
    .input-container{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }

    .square{
        width:1.5rem;
        height:1.5rem;
        margin-right: .4rem;
        border-radius: .25rem;
        color: white;
        text-align: center;
    }

    .input{
        border: none;
        outline: none;
        border-bottom: 1px solid silver;
        width: 50px;
    }

    .input-others{
        background-color: transparent
    }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>

<b>Registre:</b>
{#each inputs as {name, value, color}, i}
    <div class='input-container'>
        <div class='square' style="background-color: {color}" >{name}</div>
        <input type="string" min="0" class='input' bind:value={value} on:blur={() => validateApply(i)} on:click={focusIn} />
    </div>
{/each}
{inputsJSON}
<br>
<select bind:value={selectedFormat}>
    {#each formats as format}
        <option value={format.id}>
            {format.text}
        </option>
    {/each}
</select>
<!--<div class='input-container'>-->
<!--    <div class='square' style="background-color: DARKORANGE" />-->
<!--    <input type='number' class='input input-others' bind:value={spOthers} disabled/>-->
<!--</div>-->
