# Ecosim server

## User/Ecosim endpoints

These are the endpoints that the user can use to request and give information to Ecosim.

- [POST `apply/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-apply): apply for a simulation
- [GET `ecosim/static/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#get-ecosimstatic): get static information
- [GET `ecosim/state/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#get-ecosimstate): get the state of the simulation
- [GET `agent/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#get-agent): get information of an agent
- [GET `agent/score/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#get-agentscore): get score for an agent
- [GET `market/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#get-market): get market
- [POST `market/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-market): accept an offer
- [PUT `market/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#put-market): post an offer
- [PUT `agent/globalRecipe`](https://github.com/carlosvpi/ecosim/blob/master/README.md#put-agentglobalRecipe): set globalRecipe to perform each cycle

### POST `apply/`

Apply for a simulation, i.e., request the control of a number of agents in an incoming simulation. This is the only endpoint available until the simulation starts.

Params:
- `name`: string, used only for display purposes, that will be attached to the agents granted to the user
- `agents`: integer. Amount of agents that the user requests
- `onStart`: string, endpoint that ecosim will use to communicate the agent that the simulation has started
- `onPoolChange`: string, endpoint that ecosim will use to communicate the user that its Pool has changed
- `onMarketChange`: string, endpoint that ecosim will use to communicate the user that the market of offers has changed
- `onAcceptedOffer`: string, endpoint that ecosim will use to communicate the user that some agent has accepted the offer of one of his agents
- `onEnd`: string, endpoint that ecosim will use to communicate the user that the simulation has ended

Return value:
- `ids`: array of integers, each of which represents an agent granted to the requester
- `time`: moment at which the simulation will start

### GET `ecosim/static/`

Request static information about the current simulation. All the values this endpoint returns are constant, so there is no need to call it more than once.

Params:
- `id`: integer. Id of an agent that is in the simulation.

Return value:
- `resources`: integer. Number of resource types in the simulation
- `globals`: \[Recipe\]. Global recipes of the simulation
- `agents`: integer. Number of agents in the simulation

### GET `ecosim/state/`

Information about the state of the simulation.

Params:
- id`: integer. Id of an agent that is in the simulation.

Return value:
- `time`: integer. Number of ms the simulation has been running since it started
- `globalPool`: Pool. Union of all the pools of all the agents in the simulation
- `state`: ("recruting" | "running" | "finished"). The state of the simulation

### GET `agent/`

Get the status of the controled agent (P, S, O, i).

Params:
- `id`: integer. Id given to the agent the user asks for

Return value:
- `pool`: Pool. The pool of the agent
- `score`: float. Result of the operation S(P), i.e., the current satisfaction of the agent
- `offers`: \[Offer\]. Array of offers made by this agent
- `global`: integer. Index of the global recipe that this agent is set to apply each cycle
- `ranking`: integer. Position of the agent in the score ranking. `1` means it is winning

### GET `agent/score/`

Get the score for an agent given some Pool.

Params:
- `id`: integer. Id of the agent whose satisfaction is being requested
- `pool`: Pool. Pool of resources the user wants to know how much would satisfy this agent

Return value:
- `score`: float. Result of the operation S(P), i.e., the current satisfaction of the agent
- `amount`: integer. Amount of times the *pool* sent is available in the whole simulation at the moment of the request

### GET `market/`

Get information about the new offers in the market since last queried.

Params:
- `id` is the `id` of the agent that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.

Return value:
- `added`: \[Offer\]. Offers added to the market since last made this query
- `removed`: \[integer\]. Ids of each offer that has been removed since last made this query

### POST `market/`

Accept an offer in the market

Params:
- `id`: integer. Id of the agent that accepts the offer
- `offerId`: integer. Id of the offer accepted by the agent

Return value:
- `status`: boolean. Whether the transaction has been successful (true) or not (false)
- `pool`: Pool. Updated pool of the agent

When P changes as a result of acceppting an offer, the `onPoolChange` endpoint is not invoked.

### PUT `market/`

Post offers in, or remove it from, the market, in the name of an agent, or make it directly to another agent.

Params:
- `id`: integer. Id of the agent that accepts the offer
- `add`: \[Offer\]. Offers added to the market since last made this query
- `remove`: \[integer\]. Ids of the offers the agent made that it wants to remove from the market
- `destiny`: \[integer\]. Ids of the agents to which this offer is directly made. If not empty, the offer is not posted in the global market and only the beneficiary agents know about it.

Result value:
- `offerIds`: \[integer\]. Ids given to the added offers (in the same order)

When offers are added as a result of this endpoint, the `onNewOffers` endpoint is not invoked for this agent.

### PUT `agent/globalRecipe`

Choose a global recipe to apply each cycle

Params:
- `id`: integer. Id of the agent that accepts the offer
- `recipeIndex`: integer. Index of the global recipe for this agent to apply each cycle

Return value:
- `recipeIndex`: integer. Updated index of the global recipe for this agent to apply each cycle

### Ecosim/User endpoints

These are the endpoints that the user server must provide to Ecosim, so communication can be asynchronous and efficient.

- [POST `onStart/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-start): when starts the simulation
- [POST `onPoolChange/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-onPoolChange): when the pool changes
- [POST `onMarketChange/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-onMarketChange): when the market changes
- [POST `onAcceptedOffer/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-onAcceptedOffer): when another agent accepts an offer of this agent
- [POST `onEnd/`](https://github.com/carlosvpi/ecosim/blob/master/README.md#post-onEnd): when the simulation ends

### POST `onStart/`

Sent when the simulation starts.

Params: none

Return value: none

### POST `onPoolChange/`

Sent when the Pool of an agent has changed.

Params:
- `id`: integer. Id of the agent whose pool changed
- `pool`: Pool. New state of the agent's pool

### POST `onMarketChange/`

Sent when the market changes, i.e., there are new offers or old offers have been removed.

Params:
- `id`: integer. Id of the agent that is in the simulation where the market has changed
- `added`: \[Offer\]. Offers added to the market since last sent this message or the user made the *GET `market/`* request
- `removed`: \[integer\]. Ids of each offer that has been removed since last sent this message or the user made the *GET `market/`* request

### POST `onAcceptedOffer/`

Sent when an offer of a controlled agent has been accepted in the market.

Params:
- `id`: integer. Id of the agent whose offer has been accepted
- `offerId`: integer. Id of the offer that has been accepted
- `pool`: Pool. New pool of the agent

### POST `onEnd/`

Sent when the simulation ends.

Params: none
