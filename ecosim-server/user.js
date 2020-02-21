const User = module.exports.User = function User ({ name, onStart, onRankingChange, onPoolChange, onNewOffers, onRemovedOffer, onEnd }, simon) {
	this.name = name
	this.onStart = onStart
	this.onRankingChange = onRankingChange
	this.onPoolChange = onPoolChange
	this.onNewOffers = onNewOffers
	this.onRemovedOffer = onRemovedOffer
	this.onEnd = onEnd
	this.simon = simon
}