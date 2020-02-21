const assert = require('assert')
const {
    getRandomPool,
    Recipe,
    Offer,
    Simon,
    getCount,
    Simulation
} = require('../../lib/model')

describe('model', () => {
    describe('getRandomPool', () => {
        it('gets a random pool', () => {
            const length = 10
            const entities = 5
            assert.equal(typeof getRandomPool(entities, length), 'object')
        })
    })

    describe('Recipe', () => {
        const input = { x: 1 }
        const output = { y: 2 }
        const recipe = new Recipe (input, output)

        it('gets a random recipe', () => {
            const lengthInput = 10
            const lengthOutput = 10
            const entities = 5
            const recipe = Recipe.getRandomRecipe(entities, lengthInput, lengthOutput)
            assert.equal(typeof recipe.input, 'object')
            assert.equal(typeof recipe.output, 'object')
        })
        it('creates a recipe', () => {
            assert.equal(recipe.input, input)
            assert.equal(recipe.output, output)
        })
        it('reverses a recipe', () => {
            const reversed = recipe.reverse()
            assert.equal(reversed.input, output)
            assert.equal(reversed.output, input)
        })
        it('is applied to a pool', () => {
            const pool = {
                x: 12,
                y: 5,
                z: 2
            }
            const pool2 = recipe.apply(pool)
            assert.equal(pool2.x, pool.x - (recipe.input.x || 0) + (recipe.output.x || 0))
            assert.equal(pool2.y, pool.y - (recipe.input.y || 0) + (recipe.output.y || 0))
            assert.equal(pool2.z, pool.z - (recipe.input.z || 0) + (recipe.output.z || 0))
        })
    })

    describe('getCount', () => {
        it ('counts an empty multiset in an empty container', () => {
            assert.equal(getCount({}, {}), 0)
        })
        it ('counts an empty multiset in a nonempty container', () => {
            assert.equal(getCount({}, {x: 31, y: 26, z: 41}), 0)
        })
        it ('counts a nonempty multiset in an empty container', () => {
            assert.equal(getCount({x: 3, y: 2, z: 1}, {}), 0)
        })
        it ('counts a nonempty multiset in a nonempty container', () => {
            assert.equal(getCount({x: 3, y: 2, z: 1}, {x: 31, y: 26, z: 41}), 10)
        })
    })

    describe('Simon', () => {
        const simulation = { entities: 10, simons: [] }
        const name = 'name'
        const simon = new Simon(name, simulation)

        it ('has correct name', () => {
            assert.equal(simon.name, name)
        })
        it ('has empty pool', () => {
            assert.deepEqual(simon.pool, {})
        })
        it ('has unique id', () => {
            assert.notEqual(simon.id, (new Simon('other', simulation)).id)
        })
        it ('is appended to the simulation', () => {
            assert(simulation.simons.includes(simon))
        })
        it ('satisfaction of empty pool is zero', () => {
            assert.equal(simon.getSatisfaction(), 0)
        })
    })
})
