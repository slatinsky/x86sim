import { writable } from 'svelte/store';

// https://stackoverflow.com/a/61300826/14409632
const createWritableStore = (key, startValue) => {
    const { subscribe, set } = writable(startValue);

    return {
        subscribe,
        set,
        useLocalStorage: () => {
            const json = localStorage.getItem(key);
            if (json) {
                set(JSON.parse(json));
            }

            subscribe(current => {
                localStorage.setItem(key, JSON.stringify(current));
            });
        }
    };
}

export const selectedFormat = createWritableStore('hex')
selectedFormat.useLocalStorage();

// export const registers = writable({
//     'ax': {
//         value: 0
//     },
//     'bx': {
//         value: 0
//     },
//     'cx': {
//         value: 0
//     },
//     'dx': {
//         value: 0
//     },
// });

