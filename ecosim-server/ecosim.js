const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const { User } = require('./user')
const {
    Simulation,
    Simon
} = require('../lib/model')
const port = 3000
const entities = Math.floor(Math.random() * 50) + 50
const numberOfGlobalRecipes = Math.floor(Math.random() * 50) + 50
const simulation = new Simulation(entities, numberOfGlobalRecipes)
const users = []
const totalPool = {}

function cycle (simulationDuration, i) {
    if (i >= simulationDuration) {
        simulation.finish()
    } else {
        console.log(`CYCLE ${i}`)
        users.forEach({ simon, onPoolChange } => {
            const chosenRecipe = user.simon.globalRecipe
            if (chosenRecipe !== null) {
                const newPool = chosenRecipe.apply(user.simon.pool)
                if (newPool) {
                    Object.keys(user.simon.pool)
                        .forEach(entity => totalPool[entity] -= user.simon.pool[entity])
                    Object.keys(newPool)
                        .forEach(entity => totalPool[entity] += newPool[entity])
                    user.simon.pool = newPool
                    axios.post(onPoolChange, newPool)
                        .then(({ data }) => { console.log(data) })
                        .catch(console.error)
                }
            }
        })
        setTimeout(() => cycle(simulationDuration, i + 1), 1000)
    }
}

function countDown (i) {
    if (i <= 0) {
        simulation.start()
        console.log(`Simulation ${simulation.id} started`)
        console.groupEnd()
        users.forEach(({ name, onStart }) => {
            console.log(`Sending 'start' to '${name}' (${onStart})`)
            axios.post(onStart)
                .then(({ data }) => {
                    console.log(data)
                })
                .catch(console.error)
        })
        const simulationDuration = Math.floor(Math.random() * 1800) + 200
        setTimeout(() => cycle(simulationDuration, 0), 1000)
    } else {
        console.log(`...${i} s`)
        setTimeout(() => countDown(i-1), 1000)
    }
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    console.log('Get /')
    res.send('Success')
})

app.post('/apply', function (req, res) {
    if (simulation.state !== Simulation.state.RECRUTING) {
        res.send(false)
        return
    }
    const name = req.body.name
    const simon = simulation.addSimon(name)
    if (simon) {
        users.push(new User(req.body, simon))
        console.log(`Received application from '${name}'`)
        res.send({ id: simon.id, time: NaN })
    } else {
        res.send(false)
    }
})

app.listen(port)

console.log(`Ecosim up and running in port ${port}`)
console.group('Simulation will start in...')
countDown(3)
