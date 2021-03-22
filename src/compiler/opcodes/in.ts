import {registers, keycodes} from "../../stores/stores";
import {get} from "svelte/store";

// how ps/2 input using i8042 Keyboard Controller works: http://www-ug.eecg.toronto.edu/msl/nios_devices/datasheets/PS2%20Keyboard%20Protocol.htm

export default  {
    writesTo: [],
    run: (operand1, operand2) => {
        let constant = operand2.get()
        if (constant === 0x60) {
            if (get(keycodes).length === 0) {
                operand1.set(0)  // keyboard buffer empty
                return
            }

            keycodes.update(keycodes => {
                operand1.set(keycodes.shift())
                return keycodes
            })
        }
        else if (constant === 0x64) {
            // only IBF flag is implemented now
            let IBF = 0

            // if IBF flag is set to 1, input is available
            if (get(keycodes).length !== 0) {
                IBF = 1
            }

            operand1.set(0b00010100 | (IBF << 1))           // it's second flag bit from right
            return
            // PS/2-compatible mode (from http://www-ug.eecg.toronto.edu/msl/nios_devices/datasheets/PS2%20Keyboard%20Protocol.htm):
            // 128 PERR
            // 64 TO
            // 32 MOBF
            // 16 INH
            // 8 A2
            // 4 SYS
            // 2 IBF
            // 1 OBF
        }
        else {
            throw `in instruction - Unknown constant ${constant}, only 0x60 and 0x64 is supported`;
            // registers.dec('ip')
        }
    }
}
