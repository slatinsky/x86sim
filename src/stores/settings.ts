import {createWritableStore} from "./helpers/createWritableStore";
import {ensureObjectHasDefaultValues} from "../helperFunctions";
import {get} from "svelte/store";

export class Settings {
    public subscribe: any
    public update: any
    public set: any

    private defaultSettings = {
        debug: false,
        selectedFormat: 'hex',
        darkTheme: false,
        codeExecutionDelay: 1,
        codeExecutionHistory: true,
        codeExecutionScroll: true,
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

    constructor() {
        const {subscribe, set, update, get, useLocalStorage} = createWritableStore('settings', this.defaultSettings)
        this.subscribe = subscribe
        this.set = set
        this.update = update

        this.update(settingsObj => {
            ensureObjectHasDefaultValues(settingsObj, this.defaultSettings)
            return settingsObj
        })

        useLocalStorage()
    }

    get(): object {
        return get(this)
    }
}
