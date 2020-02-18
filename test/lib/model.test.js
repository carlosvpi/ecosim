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
	// it('tests LITERAL positive', () => {
	// 	assert.deepEqual(LITERAL('this')(input), [['LITERAL', 'this'], ' is a text'])
	// })
	// it('tests LITERAL negative', () => {
	// 	assert.deepEqual(LITERAL('that')(input), [['LITERAL', null], 'this is a text'])
	// })

	// it('tests MATCH positive', () => {
	// 	assert.deepEqual(MATCH(/\w+/)(input), [['MATCH', 'this'], ' is a text'])
	// })
	// it('tests MATCH negative', () => {
	// 	assert.deepEqual(MATCH(/[q]h?i\w/)(input), [['MATCH', null], 'this is a text'])
	// })

	// it('tests CONCAT positive', () => {
	// 	assert.deepEqual(CONCAT(
	// 		LITERAL('this'),
	// 		MATCH(/[ \t\n]/),
	// 		LITERAL('is'),
	// 	)(input), [['CONCAT', [['LITERAL', 'this'], ['MATCH', ' '], ['LITERAL', 'is']]], ' a text'])
	// })
	// it('tests CONCAT negative', () => {
	// 	assert.deepEqual(CONCAT(
	// 		LITERAL('this'),
	// 		MATCH(/[ \t\n]/),
	// 		LITERAL('was'),
	// 	)(input), [['CONCAT', null], 'this is a text'])
	// })

	// it('tests DISJUNCTION positive', () => {
	// 	assert.deepEqual(DISJUNCTION(
	// 		LITERAL('this'),
	// 		LITERAL('that'),
	// 	)(input), [['DISJUNCTION', ['LITERAL', 'this']], ' is a text'])
	// })
	// it('tests DISJUNCTION negative', () => {
	// 	assert.deepEqual(DISJUNCTION(
	// 		LITERAL('these'),
	// 		LITERAL('that'),
	// 	)(input), [['DISJUNCTION', null], 'this is a text'])
	// })

	// it('tests OPTION positive', () => {
	// 	assert.deepEqual(OPTION(
	// 		LITERAL('this')
	// 	)(input), [['OPTION', ['LITERAL', 'this']], ' is a text'])
	// })
	// it('tests OPTION negative', () => {
	// 	assert.deepEqual(OPTION(
	// 		LITERAL('that')
	// 	)(input), [['OPTION', ''], 'this is a text'])
	// })

	// it('tests CLOSURE positive', () => {
	// 	assert.deepEqual(CLOSURE(
	// 		MATCH(/\w/)
	// 	)(input), [['CLOSURE', [['MATCH', 't'],['MATCH', 'h'],['MATCH', 'i'],['MATCH', 's']]], ' is a text'])
	// })
	// it('tests CLOSURE negative', () => {
	// 	assert.deepEqual(CLOSURE(
	// 		MATCH('\W')
	// 	)(input), [['CLOSURE', []], 'this is a text'])
	// })

	// it('tests REPETITION positive', () => {
	// 	assert.deepEqual(REPETITION(
	// 		4, MATCH(/\w/)
	// 	)(input), [['REPETITION', [['MATCH', 't'],['MATCH', 'h'],['MATCH', 'i'],['MATCH', 's']]], ' is a text'])
	// })
	// it('tests REPETITION negative', () => {
	// 	assert.deepEqual(REPETITION(
	// 		5, MATCH('\W')
	// 	)(input), [['REPETITION', null], 'this is a text'])
	// })

	// it('tests EXCEPTION positive', () => {
	// 	assert.deepEqual(EXCEPTION(
	// 		MATCH(/\w+/), LITERAL('that')
	// 	)(input), [['EXCEPTION', 'this'], ' is a text'])
	// })
	// it('tests EXCEPTION negative', () => {
	// 	assert.deepEqual(EXCEPTION(
	// 		MATCH(/\w+/), LITERAL('this')
	// 	)(input), [['EXCEPTION', null], 'this is a text'])
	// })

	// it('tests EXPECT positive', () => {
	// 	const errors = []
	// 	assert.deepEqual(EXPECT(
	// 		LITERAL('this'),
	// 		'this'
	// 	)(input, { original: input, errors }), [['LITERAL', 'this'], ' is a text'])
	// 	assert.deepEqual(errors, [])
	// })
	// it('tests EXPECT negative', () => {
	// 	const errors = []
	// 	assert.deepEqual(EXPECT(
	// 		LITERAL('that'),
	// 		'that',
	// 	)(input, { original: input, errors }), [['EXPECT', null], 'this is a text'])
	// 	assert.deepEqual(errors, ["✘ 1:0 | Expected 'that', got 'this is a text...'"])
	// 	assert.deepEqual(EXPECT(
	// 		LITERAL('that'),
	// 		'that',
	// 	)(input, { original: 'original text\nwith some lines\nand then this is a text', errors }), [['EXPECT', null], 'this is a text'])
	// 	assert.deepEqual(errors, ["✘ 1:0 | Expected 'that', got 'this is a text...'", "✘ 3:9 | Expected 'that', got 'this is a text...'"])
	// 	assert.deepEqual(EXPECT(
	// 		LITERAL('Something'),
	// 		'Something',
	// 	)('', { original: 'original text\nwith some lines\nand then this is a text', errors }), [['EXPECT', null], ''])
	// 	assert.deepEqual(errors, ["✘ 1:0 | Expected 'that', got 'this is a text...'", "✘ 3:9 | Expected 'that', got 'this is a text...'", "✘ 3:23 | Expected 'Something', got end of input"])
	// })
