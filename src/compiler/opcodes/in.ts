import {registers, keycodes} from "../../stores/stores";
import {get} from "svelte/store";

// how ps/2 input using i8042 Keyboard Controller works: http://www-ug.eecg.toronto.edu/msl/nios_devices/datasheets/PS2%20Keyboard%20Protocol.htm

export default  {
    writesTo: [],
    run: (operand1, operand2) => {
        if (get(keycodes).length === 0) {
            operand1.set(0)
            return
            // throw "keyboard_buffer_empty"
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
