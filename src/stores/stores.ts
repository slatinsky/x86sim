// https://svelte.dev/tutorial/custom-stores
import {createWritableStore} from "./createWritableStore";

export {registers} from "./registers"
export {memory} from "./memory"

export const code = createWritableStore('code', '')
code.useLocalStorage();

