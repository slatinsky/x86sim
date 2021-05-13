import {createWritableStore} from "./createWritableStore";
import {locale} from "svelte-i18n";
import {get} from "svelte/store";

export const language = createWritableStore('language', null)

language.subscribe(changedLanguage => {
    locale.set(changedLanguage)
})

addEventListener("load", ()=> {
    locale.set(get(language))
})

language.useLocalStorage()
