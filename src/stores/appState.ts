import {writable} from "svelte/store";

let defaultAppState = {
    settingsShown: false,
    projectsShown: false,
    helpShown: false,
    loadingReason: ""
}

export const appState = writable(defaultAppState)
