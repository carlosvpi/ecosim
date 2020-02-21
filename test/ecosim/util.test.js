const assert = require('assert')
const { getId } = require('../../ecosim/util')

describe('util', () => {
    describe('getId', () => {
        it('gets ids and they are not the same, and they are not NaN', () => {
            const id1 = getId()
            const id2 = getId()
            assert.notEqual(id1, id2)
            assert(!Number.isNaN(id1))
            assert(!Number.isNaN(id2))
        })
    })
})
