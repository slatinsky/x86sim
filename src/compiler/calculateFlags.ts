import {registers} from "@stores";
import {intToFormattedString} from "../formatConverter";

/**
 * @param newValue Value that should be stored
 * @param storedNewValue Value that was actually stored (corrected with overflow to fit)
 */
export function calculateFlags(newValue, storedNewValue) {
    registers.resetFlags()  // all flags to zero

    // TODO: implement c, a, t, i, d
    // Simple tutorial, how flags ar set https://www.geeksforgeeks.org/flag-register-8085-microprocessor/#:~:text=In%208085%20microprocessor%2C%20flag%20register,flag%20becomes%20set%2C%20i.e.%201.
    if (storedNewValue == 0) {  // if value is zero, then set zero flag to 1
        registers.set('zf', 1)
    }
    if (storedNewValue < 0) { // if most significant bit is set to one, then set sign flag to 1
        registers.set('sf', 1)
    }

    let newValueInBinary: string = intToFormattedString(storedNewValue, 'bin', 16)
    let binaryOnesCount = (newValueInBinary.split("1").length - 1)
    if (binaryOnesCount % 2 === 0) {  // if even number of ones, set parity flag to 1
        registers.set('pf', 1)
    }

    if (newValue !== storedNewValue) {  // if stored value is not the value we wanted to store, overflow occurred
        registers.set('of', 1)
    }
    // console.log("newValue, storedNewValue", newValue, storedNewValue)
}
