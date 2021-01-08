import {appState} from "./stores/appState";

export function spinnerLoad(text: string, callback) {
    appState.setAttribute('loadingReason', text)
    setTimeout(()=> {
        callback()
        appState.setAttribute('loadingReason', '')
    }, 10)
}
