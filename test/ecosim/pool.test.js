const assert = require('assert')
const { Pool } = require('../../ecosim/pool')

describe('Pool', () => {
    describe('getRandomPool', () => {
        it('gets a random pool', () => {
            const length = 10
            const entities = 5
            assert.equal(typeof Pool.getRandomPool(entities, length), 'object')
        })
    })
    describe('count', () => {
        it('counts occurrences of a subpool in a pool (when it is contained)', () => {
            const subpool = { x: 3, y: 5 }
            const pool = { x: 7, y: 25, z: 2 }
            assert.equal(Pool.count(subpool, pool), 2)
        })
        it('counts occurrences of a subpool in a pool (when it is not contained)', () => {
            const subpool = { x: 3, y: 25 }
            const pool = { x: 7, y: 5, z: 2 }
            assert.equal(Pool.count(subpool, pool), 0)
        })
    })
    describe('add', () => {
        it('adds one pool to another', () => {
            const pool1 = { x: 3, y: 5, t: 6 }
            const pool2 = { x: 7, y: 25, z: 2 }
            const result = { x: pool1.x + pool2.x, y: pool1.y + pool2.y, z: pool2.z, t: pool1.t }
            assert.deepEqual(Pool.add(pool1, pool2), result)
        })
    })
    describe('subract', () => {
        it('subtracts a contained subpool from a pool', () => {
            const minuend = { x: 13, y: 25, z: 2 }
            const subtrahend = { x: 7, y: 5 }
            const result = { x: minuend.x - subtrahend.x, y: minuend.y - subtrahend.y, z: minuend.z }
            assert.deepEqual(Pool.subtract(minuend, subtrahend), result)
        })
        it('subtracts a contained subpool from a pool (and removes zeroed key)', () => {
            const minuend = { x: 13, y: 25, z: 2 }
            const subtrahend = { x: 7, y: 25 }
            const result = { x: minuend.x - subtrahend.x, z: minuend.z }
            assert.deepEqual(Pool.subtract(minuend, subtrahend), result)
        })
        it('returns false when subtracting a pool not contained from another pool (extra key)', () => {
            const minuend = { x: 13, y: 25 }
            const subtrahend = { x: 7, y: 5, t:1 }
            assert.equal(Pool.subtract(minuend, subtrahend), false)
        })
        it('returns false when subtracting a pool not contained from another pool (subtrahend is greater)', () => {
            const minuend = { x: 13, y: 5, }
            const subtrahend = { x: 7, y: 25 }
            assert.equal(Pool.subtract(minuend, subtrahend), false)
        })
    })
})
