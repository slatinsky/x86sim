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

export const ax = createWritableStore('ax', 0)
ax.useLocalStorage();

export const bx = createWritableStore('bx', 0)
bx.useLocalStorage();

export const cx = createWritableStore('cx', 0)
cx.useLocalStorage();

export const dx = createWritableStore('dx', 0)
dx.useLocalStorage();

export const si = createWritableStore('si', 0)
si.useLocalStorage();

export const di = createWritableStore('di', 0)
di.useLocalStorage();

export const bp = createWritableStore('bp', 0)
bp.useLocalStorage();

export const sp = createWritableStore('sp', 0)
sp.useLocalStorage();

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

