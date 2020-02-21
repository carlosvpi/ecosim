const assert = require('assert')
const { Offer } = require('../../ecosim/offer')

function Agent (pool) {
    this.pool = pool
}
Agent.prototype.setPool = function (pool) {
    this.pool = pool
}

describe('Offer', () => {
    const agent = new Agent({ x: 24, y: 15, z: 6 })
    const offer = new Offer(agent, { z: 3, t: 5 }, { x: 3, y: 8 })
    const applicablePool = { x: 3, z: 5, t: 7, u: 9 }
    const inapplicablePool = { x: 3, z: 2, t: 7, u: 9 }

    describe('isApplicable', () => {
        it('checks that a valid offer is applicable', () => {
            assert(offer.isApplicable(applicablePool))
        })
        it('checks that an invalid offer is not applicable', () => {
            assert(!offer.isApplicable(inapplicablePool))
        })
    })
    describe('apply', () => {
        it('applies an offer that is applicable', () => {
            const beneficiary = new Agent(applicablePool)
            const expectAgentPool = { x: 21, y: 7, z: 9, t: 5 }
            const expectBeneficiaryPool = { x: 6, y: 8, z: 2, t: 2, u: 9 }

            assert(offer.apply(beneficiary))
            assert.deepEqual(agent.pool, expectAgentPool)
            assert.deepEqual(beneficiary.pool, expectBeneficiaryPool)
        })
        it('does not apply an offer that is not applicable', () => {
            const beneficiary = new Agent(inapplicablePool)

            assert(!offer.apply(beneficiary))
        })
    })
})
