import {registers, keycodes} from "../../stores/stores";
import {get} from "svelte/store";

// pushes value to stack
export default  {
    writesTo: [],
    run: (operand1, operand2) => {
        if (get(keycodes).length === 0) {
            throw "keyboard_buffer_empty"
        }

        let constant = operand2.get()
        if (constant === 0x60) {
            keycodes.update(keycodes => {
                operand1.set(keycodes.shift())
                return keycodes
            })

        }
        else {
            throw `in instruction - Unknown constant ${constant}, only 96 is supported`
            // registers.dec('ip')
        }
    }
}
