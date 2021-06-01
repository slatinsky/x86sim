import {createWritableStore} from "@stores/helpers/createWritableStore";

let defaultAppState = {
    settingsShown: false,
    projectsShown: false,
    helpShown: false,
    loadingReason: ""
}

export const appState = createWritableStore("appState", defaultAppState)
// for some reason it doesn't work with default 'writable' from svelte
// errors out while switching projects
