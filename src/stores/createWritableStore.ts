// https://stackoverflow.com/a/61300826/14409632
import {writable} from "svelte/store";

export const createWritableStore = (key, startValue) => {
    const {subscribe, set} = writable(startValue);

    return {
        subscribe,
        set,
        useLocalStorage: () => {
            const json = localStorage.getItem(key);
            if (json) {
                try {
                    // try to parse json and set the store variable
                    set(JSON.parse(json));      //TODO delete the key if it is invalid (for example 'undefined')
                } catch (e) {
                    // key is not a valid json, delete it
                    localStorage.removeItem(key)
                    console.error(key, "was not a valid json and it was deleted:", e)
                }
            }

            subscribe(current => {
                localStorage.setItem(key, JSON.stringify(current));
            });
        }
    };
}
