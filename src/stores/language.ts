import {createWritableStore} from "./createWritableStore";
import {locale} from "svelte-i18n";

export const language = createWritableStore('language', null)
language.useLocalStorage()

language.subscribe(changedLanguage => {
    locale.set(changedLanguage)
})
