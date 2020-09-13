import { Model } from './Model.js'
import { Collection } from './Collection.js'
import { View } from './View.js'

const model = new Model({value : 0})
model.on('change', event => {
    console.log('model', event)
})

console.log(model)

const collection = new Collection({models : [model]})
collection.on('change', event => {
    console.log('collection', event)
})

console.log(collection)

const view = new View({
    el : '#test1',
    events : {
        'change' : event => {
            view.model.value = event.target.value
        }
    },
    model
})
view.render = event => {
    view.element.value = event.value
}

console.log(view)

const model2 = new Model({value : 0})
collection.add(model2)
const view2 = new View({
    el : '#container',
    events : {
        'change #test2' : event => {
            view2.model.value = event.target.value
        }
    },
    model : model2
})
view2.render = event => {
    view2.element.value = event.value
}

console.log(view2)

window.model = model
window.collection = collection
window.view = view