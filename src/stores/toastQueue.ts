import {get, writable} from "svelte/store";

type tToast = 'success' | 'error'
interface tToastObj {
    type: tToast,
    msg: string
}

class ToastQueue {
    subscribe: any
    private readonly update: any
    private set: any

    /**
     * Add message do queue
     */
    private enqueue(type: tToast, msg: string) {
        let objToInsert: tToastObj = {
            type,
            msg
        }
        this.update(storeObj => {
            storeObj = [...storeObj, objToInsert]
            return storeObj
        })
    }

    constructor() {
        const {subscribe, set, update} = writable([]);
        this.set = set
        this.subscribe = subscribe
        this.update = update
    }

    success(msg: string) {
        this.enqueue('success', msg)
    }

    error(msg: string) {
        this.enqueue('error', msg)
    }

    dequeue() {
        let itemRemoved
        this.update(storeObj => {
            let queue = this.get()
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

    /**
     * get queue array from svelte store
     * @private
     */
    private get(): tToastObj[] {
        return get(this)
    }
}

export const toastQueue = new ToastQueue();
