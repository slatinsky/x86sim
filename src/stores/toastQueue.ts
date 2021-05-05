import {get, writable} from "svelte/store";

type tToast = 'success' | 'error'
interface tToastObj {
    type: tToast,
    msg: string
}

function createToastQueue() {
    const {subscribe, set, update} = writable([]);



    /**
     * Add message do queue
     */
    const enqueue = (type: tToast, msg: string) => {
        let objToInsert: tToastObj = {
            type,
            msg
        }
        update(storeObj => {
            storeObj = [...storeObj, objToInsert]
            return storeObj
        })
    }

    const thisStore = {
        subscribe,
        set,
        update,
        success: (msg: string) => {
            enqueue('success', msg)
        },
        error: (msg: string) => {
            enqueue('error', msg)
        },
        dequeue: () => {
            let itemRemoved
            update(storeObj => {
                let queue = get(thisStore)
                if (queue.length === 0) {
                    itemRemoved = null
                }
                else {
                    itemRemoved = queue.shift()
                    storeObj = storeObj
                }
                return storeObj
            })
            return itemRemoved
        }
    }

    return thisStore
}

export const toastQueue = createToastQueue();
