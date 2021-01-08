import {appState} from "./stores/appState";

export function spinnerLoad(text: string, callback) {
    appState.set('loadingReason', text)
    setTimeout(()=> {
        callback()
        appState.set('loadingReason', '')
    }, 10)
}
