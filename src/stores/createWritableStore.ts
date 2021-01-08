// https://stackoverflow.com/a/61300826/14409632
import {get, writable} from "svelte/store";

export const createWritableStore = (key, startValue) => {
    const {subscribe, set, update} = writable(startValue);

    const thisStore =  {
        subscribe,
        update,
        set: (arg1: any, arg2?: any) => {
            if (typeof arg2 !== "undefined") {
                // alternative way to set attribute by name
                let attributeName = arg1
                let newValue = arg2
                update(storeObj => {
                    storeObj[attributeName] = newValue
                    return storeObj
                })
            }
            else {
                // default svelte call
                set(arg1)
            }
        },
        get: attributeName => get(thisStore)[attributeName],
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

    return thisStore
}
