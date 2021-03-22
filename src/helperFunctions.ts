// counts the words in a string
export function wordCount(str) {
    return str.trim().split(" ").length;
}

// returns first word in a string
export function firstWord(str) {
    return str.trim().split(" ")?.[0]
}

/**
 * TODO: fix
 * Adds default values to stores if the don't have
 * Reason they don't have may be that they loaded older version of the data format
 */
export function ensureObjectHasDefaultValues(object: {}, defaultValues: {}) {
    for (const [key, value] of Object.entries(defaultValues)) {
        if (!object.hasOwnProperty(key)) {
            object[key] = value
        }
    }
}
