const { Agent } = require('./agent')
const { Simulation } = require('./simulation')

const NetworkUser = module.exports.NetworkUser = function NetworkUser (name, ecosimEndpoint, userEndpoint, network, server, {
    onStart,
    onPoolChange,
    onMarketChange,
    onAcceptedOffer,
    onEnd
}) {
    this.name = name
    this.userEndpoint = userEndpoint
    this.ecosimEndpoint = ecosimEndpoint
    this.network = network
    this.server = server
    this.agents = []
    this.onStart = onStart
    this.onPoolChange = onPoolChange
    this.onMarketChange = onMarketChange
    this.onAcceptedOffer = onAcceptedOffer
    this.onEnd = onEnd
}

NetworkUser.prototype.apply = function (agents) {
    return this.network.post(`${this.ecosimEndpoint}/apply`, {
        name,
        agents,
        ...this.userEndpoint
    }).then(({ data }) => {
        if (!data) {
            console.log('Rejected')
            return
        }
        console.log(`Granted access with id ${data.ids}`)
        const simulation = new Simulation()
        this.agents.push(...data.ids.map(id => new Agent(name, simulation, id)))

        this.server.post(this.userEndpoint.onStart, function (req, res) {
            this.onStart()

            this.server.post(this.userEndpoint.onPoolChange, function (req, res) {
                const agent = this.agents.find(({ id }) => id === req.body.id)
                if (!agent) return
                const oldPool = agent.pool
                agent.pool = req.body.pool
                this.onPoolChange(agent, oldPool)
                res.send(true)
            })

            this.server.post(this.userEndpoint.onMarketChange, function (req, res) {
                this.onMarketChange(req.body.added, req.body.removed)
                res.send(true)
            })

            this.server.post(this.userEndpoint.onAcceptedOffer, function (req, res) {
                const agent = this.agents.find(({ id }) => id === req.body.id)
                if (!agent) return
                const oldPool = agent.pool
                agent.pool = req.body.pool
                const offer = simulation.findOffer(req.body.offerId)
                simulation.removeOffer(req.body.offerId)

                this.onAcceptedOffer(agent, offer)
                res.send(true)
            })

            this.server.post(this.userEndpoint.onEnd, function (req, res) {
                this.onEnd()
                res.send(true)
            })

            res.send(true)
        })

        this.server.listen(port)

        return data
    }).catch(error => {
        console.error(error)
    })
}

NetworkUser.prototype.getSimulationInfo = function () {
    return this.network.get(`${this.ecosimEndpoint}/ecosim/static`, { agentId: this.agents[0].id })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.getSimulationState = function () {
    return this.network.get(`${this.ecosimEndpoint}/ecosim/state`, { agentId: this.agents[0].id })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.getAgentState = function (agent) {
    return this.network.get(`${this.ecosimEndpoint}/agent`, { agentId: agent.id })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.getAgentScoreForPool = function (agent, pool) {
    return this.network.get(`${this.ecosimEndpoint}/agent/score`, { agentId: agent.id, pool })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.getOffers = function () {
    return this.network.get(`${this.ecosimEndpoint}/market`, { agentId: this.agents[0].id })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.acceptOffer = function (agent, offer) {
    return this.network.post(`${this.ecosimEndpoint}/market`, { agentId: agent.id, offerId: offer.id })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.postOffers = function (agent, add = [], remove = []) {
    return this.network.put(`${this.ecosimEndpoint}/market`, { agentId: agent.id, add, remove })
        .then(({ data }) => {
            add.forEach((offer, index) => {
                offer.id = data.offerIds[index]
            })

            return data
        })
        .catch(error => {
            console.error(error)
        })
}

NetworkUser.prototype.setGlobalRecipeIndex = function (agentId, recipeIndex) {
    return this.network.put(`${this.ecosimEndpoint}/agent/globalRecipe`, { agentId, recipeIndex })
        .then(({ data }) => data)
        .catch(error => {
            console.error(error)
        })
}
