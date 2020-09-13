import { Messanger } from './node_modules/js-minievents/Messanger.js'

function select(selector) {
    var scope = document
    if (this instanceof Element) scope = this
    return scope.querySelector(selector)
}

function selectAll(selector) {
    var scope = document
    if (this instanceof Element) scope = this
    return scope.querySelectorAll(selector)
}

class View extends Messanger {
    constructor({model, collection, el, id, className, tagName, attributes, events} = {}) {
        super()
        tagName = tagName || 'div'
        if (typeof el === 'string') el = this.select(el)
        this.collection = collection
        this.element = el || document.createElement(tagName)
        this.events = events
        this.model = model
        this._render = function render(event) {
            // no-op
            console.log('view.render', event)
        }
        // 
        this.element.classList.add(className)
        this.addChangeEvent()
        // map events
        for (const key in this.events) {
            const fn = this.events[key]
            var event, id, delegate
            if (key.includes(' ')) {
                [event, id] = key.split(' ')
                delegate = this.select(id)
            }else{
                event = key
            }
            if (!delegate) delegate = this.element
            if (typeof fn === 'function') {
                delegate.addEventListener(event, fn.bind(this))
            }else{
                console.log(id, delegate)
                delegate.addEventListener(event, this[fn].bind(this))
            }
        }
    }
    get render() {
        return this._render.bind(this)
    }
    set render(val) {
        this.removeChangeEvent()
        this._render = val
        this.addChangeEvent()
    }
    addChangeEvent() {
        if (this.model) this.model.on('change', this.render)
        if (this.collection) this.collection.on('change', this.render)
    }
    removeChangeEvent() {
        if (this.model) this.model.off('change', this.render)
        if (this.collection) this.collection.off('change', this.render)
    }
    select(selector) {
        if (this.element) {
            var bound = select.bind(this.element)
            return bound(selector)
        }else{
            return select(selector)
        }
    }
    selectAll(selector) {
        if (this.element) {
            var bound = selectAll.bind(this.element)
            return bound(selector)
        }else{
            return selectAll(selector)
        }
    }
}

View.select = select
View.selectAll = selectAll

export { View }