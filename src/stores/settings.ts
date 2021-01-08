import {createWritableStore} from "./createWritableStore";

const defaultSettings = {
    debug: false,
    selectedFormat: 'hex',
    darkTheme: false
}

export const settings = createWritableStore('settings', defaultSettings)
