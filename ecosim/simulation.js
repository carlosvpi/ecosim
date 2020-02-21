const { getId } = require('./util')

const Simulation = module.exports.Simulation = function Simulation () {
	this.id = getId()
	this.market = []
	this.agents = []
	this.state
}

Simulation.states = {}
Simulation.states.CREATED = 'created'
Simulation.states.COLLECTING = 'collecting'
Simulation.states.RUNNING = 'running'
Simulation.states.FINISHED = 'finished'

Simulation.prototype.addAgent = function addAgent (name, c) {

}