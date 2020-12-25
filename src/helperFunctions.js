// counts the words in a string
export function wordCount(str) {
    return str.trim().split(" ").length;
}

// returns first word in a string
export function firstWord(str) {
    return str.trim().split(" ")?.[0]
}
