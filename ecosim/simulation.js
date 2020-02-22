const { getId } = require('./util')

const Simulation = module.exports.Simulation = function Simulation (wealthTax, wealthTaxCycle, valueAddedTax) {
	this.id = getId()
	this.market = []
	this.agents = []
	this.state
	this.wealthTax = wealthTax
	this.wealthTaxCycle = wealthTaxCycle
	this.valueAddedTax = valueAddedTax
}

Simulation.states = {}
Simulation.states.CREATED = 'created'
Simulation.states.COLLECTING = 'collecting'
Simulation.states.RUNNING = 'running'
Simulation.states.FINISHED = 'finished'

Simulation.prototype.addAgent = function addAgent (name, c) {

}