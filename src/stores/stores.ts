// https://svelte.dev/tutorial/custom-stores
import {writable} from "svelte/store";
import {createWritableStore} from "./createWritableStore";

export {registers} from "./registers"
export {memory} from "./memory"
export {settings} from "./settings"
export {appState} from "./appState"

export const code = createWritableStore('code', '')
code.useLocalStorage();

export const projectName = createWritableStore('projectName', 'unnamed project')
projectName.useLocalStorage();

export const programs = createWritableStore('programs', [])
programs.useLocalStorage();

