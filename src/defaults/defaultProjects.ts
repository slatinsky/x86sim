import tutorial from "./defaultProjects/tutorial.json"

/*
 * Crash course how to modify tutorials:
 *
 * 1) open file "./defaultProjects/tutorial.json" and copy it's content to clipboard
 * 2) open simulator in your browser
 * 3) open devtools (F12) -> Application -> localstorage
 * 4) replace content of 'projects' key with tutorials
 * 5) modify tutorials inside simulator
 * 6) and copy them back from localstorage to "./defaultProjects/tutorial.json" file
 */
const defaultProjectsJson = [...tutorial]
export const defaultProjectsName = "tutorial 00 - welcome"
export default defaultProjectsJson
