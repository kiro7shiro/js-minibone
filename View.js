import { Messanger } from './js-events/Messanger.js'

/**
 * Monkey coders view. This represents the html page loaded in the browser.
 * It's purpose is to provide functionallity for manipulating the DOM.
 * @constructor
 */
class View2 extends Messanger {
    constructor () {
        super()
        document.querySelectorAll('[id]').forEach(element => {
            this[element.id] = element
            element.addEventListener('click', event => {
                this.post('click', event)
                this.post(event.target.id + 'Click', event)
            })
            element.addEventListener('change', event => {
                this.post('change', event)
                this.post(event.target.id + 'Change', event)
            })
        }, this)
        this.on('update', this.update, this)
    }
    /**
     * Read a forms data and return an object with the values.
     * @param {String} id The id attribute of the form to read.
     */
    readForm (id) {
        if (this[id]) {
            const data = new FormData(this[id])
            var result = {}
            for (var pair of data.entries()) {
                result[pair[0]] = pair[1]
            }
        }
        return result
    }
    /**
     * Perform a view update
     * @param {Object} data 
     */
    update (data) {
        if (!data) return
        let {id, val, css} = data
        if (this[id].draw) this[id].draw({val, css})
    }
}

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

class View extends EventTarget {
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
            console.log('view.render', event.target.constructor.name, event)
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
        if (this.model) this.model.addEventListener('change', this.render)
        if (this.collection) this.collection.addEventListener('change', this.render)
    }
    removeChangeEvent() {
        if (this.model) this.model.removeEventListener('change', this.render)
        if (this.collection) this.collection.removeEventListener('change', this.render)
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