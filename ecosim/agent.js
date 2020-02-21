const { getId } = require('./util')
const { Offer } = require('./offer')

const Agent = module.exports.Agent = function Agent (name, simulation, id = getId()) {
    this.name = name
    this.simulation = simulation
    this.id = id
    this.pool = {}
    this.globalRecipeIndex = null
    this.offers = []
}

Agent.prototype.setPool = function setPool (pool) {
    return this.pool = pool
}

Agent.prototype.makeOffer = function makeOffer (input, output) {
    const offer = new Offer(this, input, output)
    this.offers.push(offer)
    return this.simulation.addOffer(offer)
}

Agent.prototype.removeOffer = function removeOffer (id) {
    const offer = this.offers.find(offer => offer.id === id)

    if (!offer) return false

    this.offers = this.offers.filter(offer => offer.id !== id)

    return this.simulation.removeOffer(id)
}

Agent.prototype.acceptOffer = function acceptOffer (id) {
    const offer = this.simulation.findOffer(id)

    if (!offer) return false

    const isAccepted = offer.apply(this)

    if (isAccepted) {
        this.simulation.removeOffer(id)
        return true
    } else {
        return false
    }
}
