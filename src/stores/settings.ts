import {createWritableStore} from "./createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";

const defaultSettings = {
    debug: false,
    selectedFormat: 'hex',
    darkTheme: false,
    codeExecutionDelay: 1
}

export const settings = createWritableStore('settings', defaultSettings)
settings.update(settingsObj => {
    ensureObjectHasDefaultValues(settingsObj, defaultSettings)
    return settingsObj
})

settings.useLocalStorage()
