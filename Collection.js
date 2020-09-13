import { Messanger } from './node_modules/js-minievents/Messanger.js'

class Collection extends Messanger {
    constructor({models} = {}) {
        super()
        this.models = []
        if (models.length) this.add(models)
    }
    add(models) {
        if (models instanceof Array) {
            models.forEach(model => this.add(model))
        }else{
            var model = models
            var index = this.models.push(model)
            model.on('change', this.onChange.bind(this, index))
            this.post('add', index)
            return index
        }
    }
    onChange(index, event) {
        this.post('change', {
            index : index,
            prop : event
        })
    }
}

export { Collection }