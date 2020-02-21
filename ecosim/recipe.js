const { Pool } = require('./pool')
const { getId } = require('./util')

const Recipe = module.exports.Recipe = function Recipe (input, output) {
    this.input = input
    this.output = output
    this.id = getId()
}

Recipe.getRandomRecipe = function getRandomRecipe (types, lengthInput = Math.floor(Math.random() * 10), lengthOutput = Math.floor(Math.random() * 10)) {
    return new Recipe(Pool.getRandomPool(types, lengthInput), Pool.getRandomPool(lengthOutput))
}

Recipe.prototype.apply = function apply (pool) {
	const subtracted = Pool.subtract(pool, this.input)
    return subtracted && Pool.add(subtracted, this.output)
}

Recipe.prototype.reverseApply = function reverseApply (pool) {
	const subtracted = Pool.subtract(pool, this.output)
    return subtracted && Pool.add(subtracted, this.input)
}
