class Collection extends EventTarget {
    constructor({models, options} = {}) {
        super()
        this.models = models || []
        if (this.models.length) {
            this.models.forEach(model, index => {
                model.addEventListener('change', this.onChange.bind(this, index))
            })
        }
    }
    add(models) {
        if (models instanceof Array) {
            models.forEach(model => this.add(model))
        }else{
            var model = models
            var index = this.models.push(model)
            model.addEventListener('change', this.onChange.bind(this, index))
            this.dispatchEvent(new CustomEvent('add', {detail : model}))
            return index
        }
    }
    onChange(index, event) {
        this.dispatchEvent(new CustomEvent('change', {detail : {
            index : index,
            prop : event.detail
        }}))
    }
}

export { Collection }