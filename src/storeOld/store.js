import {writable, get} from 'svelte/store';

// https://stackoverflow.com/a/61300826/14409632
const createWritableStore = (key, startValue) => {
    const {subscribe, set} = writable(startValue);

    return {
        subscribe,
        set,
        useLocalStorage: () => {
            const json = localStorage.getItem(key);
            if (json) {
                try {
                    // try to parse json and set the storeOld variable
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

export const bp = createWritableStore('bp', 2000)
bp.useLocalStorage();

export const sp = createWritableStore('sp', 2000)
sp.useLocalStorage();

export const code = createWritableStore('code', `; Ukážkový assembler kód
; Spočítaj čísla v intervale 1-10

mov cx, 10
xor ax,ax

loop:
    add ax, cx
    dec cx
    jnz loop

end:
hlt
`)
code.useLocalStorage();


export const programs = createWritableStore('programs', [])
programs.useLocalStorage();

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


export const settingsShown = createWritableStore("settingsShown", false);
settingsShown.useLocalStorage();

export const projectName = createWritableStore('projectName', "")
projectName.useLocalStorage();

export const projectsShown = createWritableStore("projectsShown", false);
projectsShown.useLocalStorage();



// projectsShown.subscribe(() => {
//     console.log("projectsShown.subscribe")
//     if (!get(projectsShown) && get(projectName) === "") {
//         projectsShown.set(true)
//         alert("Prosím vytvorte nový projekt")
//     }
// })

export const helpShown = createWritableStore("helpShown", false);
helpShown.useLocalStorage();

export const debug = createWritableStore("debug", true);
debug.useLocalStorage();

export const darkTheme = createWritableStore('darkTheme', false)
darkTheme.useLocalStorage();

export const loadingReason = writable("");


