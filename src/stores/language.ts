import {createWritableStore} from "./helpers/createWritableStore";
import {locale} from "svelte-i18n";
import {get} from "svelte/store";


class Language {
    public subscribe: any
    public set: any
    public update: any

    constructor() {
        const {subscribe, set, update, useLocalStorage} = createWritableStore('language', null)
        this.subscribe = subscribe
        this.set = set
        this.update = update

        useLocalStorage()

        this.subscribe(changedLanguage => {
            locale.set(changedLanguage)
        })

        setTimeout(()=> {
            locale.set(get(this))
        }, 1000)
    }
}

export const language = new Language()






