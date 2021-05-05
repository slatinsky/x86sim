// modified https://github.com/lili21/svelte-toast/blob/master/src/index.js

import _Toast from './Toast.svelte'

export default class Toast {
    constructor (opts) {
        this.opts = Object.assign({
            position: 'bottom-center',
            duration: 3000
        }, opts)
    }

    show (msg, opts = {}) {
        this._show(msg, opts, 'default')
    }

    info (msg, opts = {}) {
        this._show(msg, opts, 'info')
    }

    success (msg, opts = {}) {
        this._show(msg, opts, 'success')
    }

    error (msg, opts = {}) {
        this._show(msg, opts, 'error')
    }

    _show (msg, opts, type) {
        const _opts = Object.assign({}, this.opts, opts)
        const t = new _Toast({
            target: document.querySelector('body'),
            props: {
                msg,
                type,
                position: _opts.position
            }
        })

        setTimeout(() => {
            t.$set({ type: type + ' ' + 'anim' })
        }, 100)

        setTimeout(() => {
            t.$destroy()
        }, _opts.duration)
    }
}
