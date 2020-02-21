const { Recipe } = require('./recipe')
const { getId } = require('./util')

const Offer = module.exports.Offer = function Offer (owner, input, output, id = getId()) {
	this.owner = owner
	this.recipe = new Recipe(input, output)
    this.id = id
}

Offer.prototype.isApplicable = function isApplicable (pool) {
	return !!this.recipe.apply(pool)
}

Offer.prototype.apply = function apply (beneficiary) {
	const newOwnerPool = this.recipe.reverseApply(this.owner.pool)
	const newBeneficiaryPool = this.recipe.apply(beneficiary.pool)
	if (!!newOwnerPool && !!newBeneficiaryPool) {
		this.owner.setPool(newOwnerPool)
		beneficiary.setPool(newBeneficiaryPool)
		return true
	} else {
		return false
	}
}
