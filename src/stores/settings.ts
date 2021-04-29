import {createWritableStore} from "./createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";

const defaultSettings = {
    debug: false,
    selectedFormat: 'hex',
    darkTheme: false,
    codeExecutionDelay: 1,
    shownModules: {
        showCalculator: false,
        showRegisters: true,
        showScreen: true,
        showKeyboard: true,
        showStack: true,
        showMemory: true,
        showCodeEditor: true
    }
}

export const settings = createWritableStore('settings', defaultSettings)
settings.update(settingsObj => {
    ensureObjectHasDefaultValues(settingsObj, defaultSettings)
    return settingsObj
})



settings.useLocalStorage()
