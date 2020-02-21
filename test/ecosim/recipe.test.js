const assert = require('assert')
const { Recipe } = require('../../ecosim/recipe')
const { Pool } = require('../../ecosim/pool')

describe('Recipe', () => {
    describe('getRandomRecipe', () => {
        it('gets a random recipe', () => {
            const length = 10
            const entities = 5
            assert.equal(typeof Recipe.getRandomRecipe(entities), 'object')
        })
    })
    describe('apply', () => {
        const recipe = new Recipe ({ x: 7, y: 25, z: 2 }, { x: 8, t: 1 })

        it('applies a recipe to a (valid) pool', () => {
            const pool = { x: 8, y: 27, z: 2, u: 5 }
            const expect = { x: 9, y: 2, t: 1, u: 5 }
            assert.deepEqual(recipe.apply(pool), expect)
        })
        it('applies a recipe to a (invalid) pool', () => {
            const pool = { x: 6, y: 27, z: 2, u: 5 }
            assert(!recipe.apply(pool))
        })
    })
    describe('reverseApply', () => {
        const recipe = new Recipe ({ x: 8, t: 1 }, { x: 7, y: 25, z: 2 })

        it('applies a recipe to a (valid) pool', () => {
            const pool = { x: 8, y: 27, z: 2, u: 5 }
            const expect = { x: 9, y: 2, t: 1, u: 5 }
            assert.deepEqual(recipe.reverseApply(pool), expect)
        })
        it('applies a recipe to a (invalid) pool', () => {
            const pool = { x: 6, y: 27, z: 2, u: 5 }
            assert(!recipe.reverseApply(pool))
        })
    })
})
