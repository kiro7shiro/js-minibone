class Model extends EventTarget {
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
                    this.dispatchEvent(new CustomEvent('change', {detail : detail}))
                    this.dispatchEvent(new CustomEvent('change:' + key, {detail : detail}))
                }
            })
        }
    }
}

export { Model }