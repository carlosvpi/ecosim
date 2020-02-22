const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')

const name = 'L. Mises'
const port = 3001
const onStart = 'onStart'
const onRankingChange = 'onRankingChange'
const onPoolChange = 'onPoolChange'
const onNewOffers = 'onNewOffers'
const onRemovedOffer = 'onRemovedOffer'
const onEnd = 'onEnd'

function simon(id) {
    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.get('/', function (req, res) {
        console.log('Get /')
        res.send('Success')
    })

    app.post(`/${onStart}`, function (req, res) {
        console.log('Simulation starts')
        res.send(true)
    })

    app.post(`/${onRankingChange}`, function (req, res) {
        console.log('Ranking has changed!')
        res.send(true)
    })

    app.listen(port)
    console.log(`'${name}' listening in port ${port}`)
}

axios.post('http://localhost:3000/apply', {
    name,
    onStart: `http://localhost:${port}/${onStart}`,
    onRankingChange: `http://localhost:${port}/${onRankingChange}`,
    onPoolChange: `http://localhost:${port}/${onPoolChange}`,
    onNewOffers: `http://localhost:${port}/${onNewOffers}`,
    onRemovedOffer: `http://localhost:${port}/${onRemovedOffer}`,
    onEnd: `http://localhost:${port}/${onEnd}`
}).then(({ data }) => {
    if (!data) {
        console.log('Rejected')
        return
    }
    console.log(`Granted access with id ${data.id}`)
    simon(data.id)
}).catch(error => {
    console.error(error)
})