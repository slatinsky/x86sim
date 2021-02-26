import {registers} from "../stores/stores";

export function calculateFlags(newValue) {
    registers.resetFlags()

    if (newValue == 0) {
        // Simple tutorial, how flags ar set https://www.geeksforgeeks.org/flag-register-8085-microprocessor/#:~:text=In%208085%20microprocessor%2C%20flag%20register,flag%20becomes%20set%2C%20i.e.%201.
        registers.set('zf', 1)

        // TODO: implement c, p, a, s, t, i, d, o
        // TODO: implement in memory too
    }
}
