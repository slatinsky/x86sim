// https://svelte.dev/tutorial/custom-stores
import {writable} from "svelte/store";
import {createWritableStore} from "./createWritableStore";

export {registers} from "./registers"
export {memory} from "./memory"
export {settings} from "./settings"
export {appState} from "./appState"

export const code = writable('')
export const projectName = writable('unnamed project')

export const programs = createWritableStore('programs', [])
programs.useLocalStorage();

