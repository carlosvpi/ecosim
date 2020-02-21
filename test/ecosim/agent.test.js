const assert = require('assert')
const { Agent } = require('../../ecosim/agent')
const { Offer } = require('../../ecosim/offer')

const simulation = {
    offers: [],
    addOffer: (offer) => {
        simulation.offers.push(offer)
        simulation.addOffer.callCount = (simulation.addOffer.callCount || 0) + 1
        return offer.id
    },
    removeOffer: (id) => {
        const found = !!simulation.offers.find(offer => offer.id === id)
        simulation.offers = simulation.offers.filter(offer => offer.id === id)
        simulation.removeOffer.callCount = (simulation.removeOffer.callCount || 0) + 1
        return found
    },
    findOffer: (id) => {
        const offer = simulation.offers.find(offer => offer.id === id)
        simulation.offers = simulation.offers.filter(offer => offer.id === id)
        simulation.findOffer.callCount = (simulation.findOffer.callCount || 0) + 1
        return offer
    }
}

describe('Agent', () => {
    const j = new Agent('Agent J', simulation)
    const k = new Agent('Agent K', simulation)
    let offerId

    describe('setPool', () => {
        it('sets the pool of agents', () => {
            assert(j.setPool({ x: 24, y: 15, z: 6 }))
            assert.deepEqual(j.pool, { x: 24, y: 15, z: 6 })
            assert(k.setPool({ x: 3, z: 5, t: 7, u: 9 }))
            assert.deepEqual(k.pool, { x: 3, z: 5, t: 7, u: 9 })
        })
    })
    describe('makeOffer', () => {
        it('makes an offer', () => {
            const addOfferCallCount = simulation.addOffer.callCount || 0

            offerId = j.makeOffer({ z: 3, t: 5 }, { x: 3, y: 8 })

            assert(offerId)
            assert.equal(simulation.findOffer(offerId).owner, j)
            assert.equal(simulation.addOffer.callCount, addOfferCallCount + 1)
        })
    })
    describe('removeOffer', () => {
        it('removes an offer', () => {
            const removeOfferCallCount = simulation.removeOffer.callCount || 0

            assert(j.removeOffer(offerId))
            assert.equal(simulation.removeOffer.callCount, removeOfferCallCount + 1)
        })
        it('returns false when removing an offer that does not exist', () => {
            const removeOfferCallCount = simulation.removeOffer.callCount || 0

            assert(!j.removeOffer(NaN))
            assert.equal(simulation.removeOffer.callCount, removeOfferCallCount)
        })
    })
    describe('acceptOffer', () => {
        beforeEach(() => {
            j.setPool({ x: 24, y: 15, z: 6 })
            k.setPool({ x: 3, z: 5, t: 7, u: 9 })
        })

        it('accepts an offer that exists', () => {
            const findOfferCallCount = simulation.findOffer.callCount || 0
            const expectAgentPool = { x: 21, y: 7, z: 9, t: 5 }
            const expectBeneficiaryPool = { x: 6, y: 8, z: 2, t: 2, u: 9 }
            offerId = j.makeOffer({ z: 3, t: 5 }, { x: 3, y: 8 })

            assert(k.acceptOffer(offerId))
            assert.equal(simulation.findOffer.callCount, findOfferCallCount + 1)
            assert.deepEqual(j.pool, expectAgentPool)
            assert.deepEqual(k.pool, expectBeneficiaryPool)
        })
        it('returns false when accepting an offer that does not exist', () => {
            const findOfferCallCount = simulation.findOffer.callCount || 0
            const expectAgentPool = { x: 24, y: 15, z: 6 }
            const expectBeneficiaryPool = { x: 3, z: 5, t: 7, u: 9 }

            assert(!k.acceptOffer(NaN))
            assert.equal(simulation.findOffer.callCount, findOfferCallCount + 1)
            assert.deepEqual(j.pool, expectAgentPool)
            assert.deepEqual(k.pool, expectBeneficiaryPool)
        })
    })
})
