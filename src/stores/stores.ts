// https://svelte.dev/tutorial/custom-stores
import {writable} from "svelte/store";

import {programs, projectName} from "./programs"

export {registers} from "./registers"
export {memory} from "./memory"
export {settings} from "./settings"
export {programs, projectName}
export {appState} from "./appState"

export const code = writable('')

programs.loadCurrentProject()

// start autosaving current project
setInterval(()=> {
    programs.saveCurrentProject()
}, 2000)


// export const programs = createWritableStore('programs', [])
// programs.useLocalStorage();

