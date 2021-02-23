import {createWritableStore} from "./createWritableStore";

const defaultSettings = {
    debug: false,
    selectedFormat: 'hex',
    darkTheme: false,
    codeExecutionDelay: 1
}

export const settings = createWritableStore('settings', defaultSettings)
settings.useLocalStorage()
