import { writable } from 'svelte/store';

export const registers = writable({
    'ax': {
        value: 0
    },
    'bx': {
        value: 0
    },
    'cx': {
        value: 0
    },
    'dx': {
        value: 0
    },
});

