import { Messanger } from './node_modules/js-minievents/Messanger.js'

class Model extends Messanger {
    constructor(data = {}) {
        super()
        for (const key in data) {
            this['_' + key] = data[key]
            Object.defineProperty(this, key, {
                get : () => {
                    return this['_' + key]
                },
                set : (val) => {
                    this['_' + key] = val
                    const detail = {}
                    detail[key] = val
                    this.post('change', detail)
                    this.post('change:' + key, detail)
                }
            })
        }
    }
}

export { Model }