const Pool = module.exports.Pool = {}

Pool.getRandomPool = module.exports.getRandomPool = function getRandomPool (entities, length = Math.floor(Math.random() * 10)) {
    return length
        ? Array(length)
            .fill()
            .reduce((acc) => {
                acc[Math.floor(Math.random() * entities)] = Math.floor(Math.random() * 10 + 1)
                return acc
            }, {})
        : {}
}

Pool.count = function count (subpool, pool) {
    const entities = Object.keys(subpool)
    return entities.length
        ? entities.reduce((acc, entity) => {
            return subpool[entity] > 0
                ? Math.min(acc, Math.floor((pool[entity] || 0) / subpool[entity]))
                : acc
        }, Infinity)
        : 0
}

Pool.add = function add (pool1, pool2) {
    const result = { ...pool1 }
    const types2 = Object.keys(pool2)

    for (let i = 0; i < types2.length; i++) {
        result[types2[i]] = (result[types2[i]] || 0) + pool2[types2[i]]
    }

    return result
}

Pool.subtract = function subtract (minuend, subtrahend) {
    const difference = { ...minuend }
    const types2 = Object.keys(subtrahend)

    for (let i = 0; i < types2.length; i++) {
        const diff = (difference[types2[i]] || 0) - subtrahend[types2[i]]
        if (diff > 0) {
            difference[types2[i]] = diff
        } else if (diff === 0) {
            delete difference[types2[i]]
        }
    }

    return difference
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
    return Pool.subtract(Pool.add(pool, this.output), this.input)
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

Simon.prototype.getSatisfaction = function getSatisfaction (pool = this.pool) {
    return Object.keys(pool).reduce((acc, entity) => {
        return acc + pool[entity] * this.basicSatisfactions[entity]
    }, 0) + this.multiSatisfactions.reduce((acc, { multiset, value }) => {
        return acc + count(multiset, pool) * value
    }, 0)
}

Simon.prototype.makeOffer = function makeOffer (recipe) {
    const offer = new Offer(this, recipe)
    this.offers.push(offer)
    this.simulation.market.push(offer)
    return offer.id
}

Simon.prototype.acceptOffer = function acceptOffer (id) {
    const offer = this.offers.find(offer => offer.id === id)
    if (!offer) return false

    const myPool = offer.recipe.apply(this.pool)
    const yourPool = offer.recipe.reverse.apply(offer.from.pool)
    if (myPool === false || yourPool === false) return false

    this.pool = newPool
    offer.from.pool = yourPool

    return true
}

Simon.newId = ((current) => function newId () {
    return current++
})(0)

const Simulation = module.exports.Simulation = function Simulation (entities = 100, numberOfGlobalRecipes = 100, limitNumberOfSimons = 1000) {
    this.id = Simulation.newId()
    this.entities = entities
    this.recipes = [
        Recipe.getRandomRecipe(0, Math.floor(Math.random() * 9) + 1),
        ...Array(numberOfGlobalRecipes - 1).fill().map(_ => Recipe.getRandomRecipe(Math.floor(Math.random() * 10), Math.floor(Math.random() * 9) + 1))
    ]
    this.simons = []
    this.market = []
    this.startTime = 0
    this.limitNumberOfSimons = limitNumberOfSimons
    this.state = Simulation.state.RECRUTING
}

Simulation.prototype.addSimon = function (name) {
    if (this.simons.length >= this.limitNumberOfSimons) return false
    const simon = new Simon(name, this)
    return simon
}

Simulation.prototype.start = function () {
    this.startTime = Date.now()
    this.state = Simulation.state.RUNNING
}

Simulation.prototype.finish = function () {
    simulation.state = Simulation.state.FINISHED
}

Simulation.state = {}
Simulation.state.RECRUTING = 'recruting'
Simulation.state.RUNNING = 'running'
Simulation.state.FINISHED = 'finished'

Simulation.newId = ((current) => function newId () {
    return current++
})(0)
