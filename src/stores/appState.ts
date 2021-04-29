import {createWritableStore} from "./createWritableStore";

let defaultAppState = {
    settingsShown: false,
    projectsShown: false,
    helpShown: false,
    loadingReason: ""
}



export const appState = createWritableStore('appState', defaultAppState)
