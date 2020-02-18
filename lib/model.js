const getRandomPool = module.exports.getRandomPool = function getRandomPool (entities, length = Math.floor(Math.random() * 10)) {
    return length
        ? Array(length)
            .fill()
            .reduce((acc) => {
                acc[Math.floor(Math.random() * entities)] = Math.floor(Math.random() * 10 + 1)
                return acc
            }, {})
        : {}
}

const Recipe = module.exports.Recipe = function Recipe (input, output) {
    this.input = input
    this.output = output
}

Recipe.getRandomRecipe = function (entities, lengthInput = Math.floor(Math.random() * 10), lengthOutput = Math.floor(Math.random() * 10)) {
    return new Recipe(getRandomPool(entities, lengthInput), getRandomPool(lengthOutput))
}

Recipe.prototype.reverse = function reverse (pool) {
    return new Recipe (this.output, this.input)
}

Recipe.prototype.apply = function apply (pool) {
    const inputElements = Object.keys(this.input).filter(element => this.input[element] > 0)
    const outputElements = Object.keys(this.output).filter(element => this.output[element] > 0)
    const result = { ...pool }
    for (let i = 0; i < inputElements.length; i++) {
        if (result[inputElements[i]] < this.input[inputElements[i]]) {
            return false
        } else {
            result[inputElements[i]] -= this.input[inputElements[i]] || 0
        }
    }
    for (let i = 0; i < outputElements.length; i++) {
        result[outputElements[i]] += this.output[outputElements[i]] || 0
    }
    return result
}

const Offer = module.exports.Offer = function Offer (from, recipe) {
    this.from = from
    this.recipe = recipe
    this.id = Offer.newId()
}

Offer.newId = ((current) => function newId () {
    return current++
})(0)

const Simon = module.exports.Simon = function Simon (name, simulation) {
    this.name = name
    this.simulation = simulation
    this.id = Simon.newId()
    this.pool = {}
    this.globalRecipe = null
    this.offers = [],
    this.basicSatisfactions = Array(simulation.entities).fill().reduce((acc, _, entity) => {
        acc[entity] = Math.random()
        return acc
    }, {})
    this.multiSatisfactions = Array(simulation.entities).fill().map(_ => ({
        value: Math.random() * 10,
        multiset: getRandomPool(simulation.entities, Math.floor(Math.random() * 10) + 1)
    }))
    simulation.simons.push(this)
}

const getCount = module.exports.getCount = function getCount (multiset, container) {
    const entities = Object.keys(multiset)
    return entities.length
        ? entities.reduce((acc, entity) => {
            return multiset[entity] > 0
                ? Math.min(acc, Math.floor((container[entity] || 0) / multiset[entity]))
                : acc
        }, Infinity)
        : 0
}

Simon.prototype.getSatisfaction = function getSatisfaction (pool = this.pool) {
    return Object.keys(pool).reduce((acc, entity) => {
        return acc + pool[entity] * this.basicSatisfactions[entity]
    }, 0) + this.multiSatisfactions.reduce((acc, { multiset, value }) => {
        return acc + getCount(multiset, pool) * value
    }, 0)
}

Simon.prototype.makeOffer = function makeOffer (recipe) {
    const offer = new Offer(this, recipe)
    this.offers.push(offer)
    return offer.id
}

Simon.prototype.acceptOffer = function acceptOffer (offer) {
    const myPool = offer.recipe.apply(this.pool)
    const yourPool = offer.recipe.reverse.apply(offer.from.pool)
    if (myPool === false || yourPool === false) {
        return false
    }
    this.pool = newPool
    offer.from.pool = yourPool
    return true
}

Simon.newId = ((current) => function newId () {
    return current++
})(0)

const Simulation = module.exports.Simulation = function Simulation (entities, recipesLength, simons) {
    this.id = Simulation.newId()
    this.entities = entities
    this.recipes = [
        getRandomRecipe(0, Math.floor(Math.random() * 10) + 1),
        ...Array(recipesLength - 1).fill().map(_ => getRandomRecipe(Math.floor(Math.random() * 10), Math.floor(Math.random() * 10) + 1))
    ]
    this.simons = simons
}

Simulation.newId = ((current) => function newId () {
    return current++
})(0)
