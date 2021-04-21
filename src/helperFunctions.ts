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

/**
 * Shallow difference (doesn't recurse into children objects)
 * Works only with objects, not with arrays
 * Returns keys of different objects
 * If one object doesn't contain key and other contains it, they are treated as differen
 */
export function objectKeyDifferences(obj1: {}, obj2: {}): any[] {
    let differences = []
    let uniqueKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])]

    for (let uniqueKey of uniqueKeys) {
        if (obj1.hasOwnProperty(uniqueKey) !== obj2.hasOwnProperty(uniqueKey)) {
            differences.push(uniqueKey)
        }
        else if(obj1[uniqueKey] !== obj2[uniqueKey]) { // now all looped keys exists in both arrays, check if values are different
            differences.push(uniqueKey)
        }
    }

    return differences
}
