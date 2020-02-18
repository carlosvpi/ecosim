# ecosim
Economic simulator

## Introduction

Ecosim is a market system simulator where different AIs compete to get the most resources. This README corresponds to the server where the simulation takes place. This server offers a REST API to external systems that can implemente the AI. A dashboard detailing the results of the simulation is also provided here.

The communication model of ecosim is server-server. Ecosim is a server, and it communicates with other servers representing the AIs of the agents.

### Definitions

Different economic resource types are represented by *elements* (which are integers), and instances of resources are called *orbs*. The agents in the system are Simons, small AIs that have to maximize their satisfaction, which is a function of the orbs they possess.

A recipe is a pair represented by (A ~> B), where A and B are *multisets* of elements, expresses that A can be transformed into B in some circumstance. In other words, if *m U n* is a multiset of elements, then (m ~> p)(m U n) = *p U n*.

### Global values of the simulation

An ecosim simulation includes the following values:

- set of recipes R, called *global recipes* G. R is static and determined at the beginning of the simulation
- set of recipes M, called *market*. M is dynamic.

### The Simons

A Simon is a cuadruple (P, S, O, i), where:

- P: Multiset(element) is the pool of resources that the Simon owns. It is initialized to the emptyset
- S: Multiset(element) -> Real, is a satisfaction function. This function is random and private; the idea is that the AI of the Simon must be able to adapt to whatever function it is given. However, the following property hold:
  - S(m U n) ≥ S(m) + S(n)
- O: set(recipe), the offers this Simon has written in the market.
- i: a recipe from the global recipes that this Simon applies every time it can. If *i* is `null`, this means this Simon doesn't want to perform any global recipe this cycle.

The goal of a Simon (P, S, O, i) is to maximize S(P) in the end of the simulation.

### Simulation time

Ecosim works in real time. A cycle is the time (in ms) that ecosim allows the Simons apply a global recipe. This is, every cycle, each Simon (P, S, O, i != `null`) is rewritten as (G[i](P), S, O, i).

The duration of the simulation is secret; this is so to better represent the real world, where no agent knows when its own end is going to come. Each simulation has a different duration.

### Parameters of the simulation

The parameters of each ecosim simulation are:

- the number of elements (|E|)
- the number of global recipes (|R|)
- the number of Simons participating in the simulation (|Simon|)
- the cycle duration (in ms)
- the number of cycles the simulation will last

## The REST API

The language for interaction between ecosim and each Simon's AI, requires defining the data format of multisets of elements and recipes.

A multiset of elements `P` is represented by a JSON hash `H` such that `H[i]` is the number of orbs of the element `i` contained in `P`.

A recipe (m ~> n) is represented by a JSON `{in: m', out: n'}`, where
- `m'` is the JSON representation of `m`
- `n'` is the JSON representation of `n`

Normal sets are represented by arrays.

While offers are recipes, for performance reasons their hash includes an `id` key that represents this recipe (`{ in, out, id }`).

### Simon/Ecosim endpoints

These are the endpoints that the Simon can use to request and give information to Ecosim.

#### Applying for a simulation

This endpoint is used to apply for a simulation, i.e., to request the control of one Simon in an incoming simulation. The "name" parameter is a tag used only for display purposes, that will be attached to the Simon granted to the requester.

**GET** `apply/`. Params: `{ name, onStart, onRankingChange, onPoolChange, onNewOffers, onRemovedOffer, onEnd }`. Returns: `{ id, time }`, where

- `id` is an ID (string) that uniquely identifies the Simon granted to the requester. If it is `null`, no the request has been rejected
- `time` is the time (in number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC) where the simulation will start
- `onStart` is the endpoint that ecosim will use to communicate the Simon that the simulation has started
- `onRankingChange` is the endpoint that ecosim will use to communicate the Simon that its ranking in the satisfatcion chart has changed
- `onPoolChange` is the endpoint that ecosim will use to communicate the Simon that its Pool has changed
- `onNewOffers` is the endpoint that ecosim will use to communicate the Simon that there are new offers in the market
- `onRemovedOffers` is the endpoint that ecosim will use to communicate the Simon that there are offers that have been removed from the market
- `onEnd` is the endpoint that ecosim will use to communicate the Simon that the simulation has ended

#### Querying status

This endpoint provides the status of the controled Simon (P, S, O, i).

**GET** `status/`. Params: `id`. Returns: `{ name, id, p, s, o, i, ranking }`, where

- `name` is the name given to the Simon during the application
- `id` is the id given to the Simon (same as the params)
- `p` is the formatted P
- `s` is a float result of the operation S(P)
- `o` is an array that represents the set O. Each item of `o` is a distinct member of `O`.
- `i` is the same `i`. Can be `null`.
- `ranking` is the position of satisfaction of this Simon in the simulation it is in. If it is 1, that means it is winning.

#### Querying the global state of ecosim

This endpoint provides large amounts of static information about the current simulation. All the values this endpoint returns are constant, so there is no need to call it more than once.

**GET** `ecosim/static/`. Params: `id`. Returns `{ e, globals, simons }`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.
- `e` is the number of elements in this simulation.
- `globals` is the array of global recipes. It is constant.
- `simons` is an integer that represents the number of Simons in the simulation. It is constant.

#### Querying the dynamic values of the simulation

This endpoint provides small bits of information about the simulation that are dynamic.

**GET** `ecosim/dynamic/`. Params: `id`. Returns `{ time, running, finished, winner }`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.
- `time` is the number of ms the simulation has been running since its beginning
- `running` is a boolean that says whether the simulation is running or not.
- `finished` is a boolean that says whether the simulation has finished or not.
- `winner` is a boolean that says whether the Simon has won its simulation or not.

If both `running` and `finished` are false, that means the simulation hasn't started yet.

#### Querying statistics

**GET** `ecosim/stats/entities`.

Returns

- `...`

#### Querying the market

This endpoint provides information about the new offers in the market since last queried.

**GET** `market/`. Params: `id`. Returns `{ added, removed }`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.
- `added` is an array of offers (with their `id`s), added to the market since last made this query
- `removed` is an array of integers, each of which represents the if of an offer that has been removed since last made this query

#### Accepting an offer form the market

This endpoint allows a Simon to accept an offer in the market.

**POST** `market/`. Params: `{ id, oid }`. Returns `{ status, p }`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried
- `oid` is the id of the offer this Simon wants to accept
- `status` is a boolean that states whether the transaction has been successful. 
- `p` is the formatted new P of this Simon

When P changes as a result of acceppting an offer, the `onPoolChange` endpoint is not invoked.

#### Posting offers in the market

This endpoint allows a Simon to post an offer in, or remove it from, the market.

**POST** `market/add`. Params: `{ id, recipes }`. Returns: `ids`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.
- `recipe` is an array of recipes `[{ in, out }]`. `in` represents what this Simon offers to give, and `out` what this Simon requests to get in exchange
- `ids` is an array of ids given to these offers (ids[i] is the id of recipes[i]).

When offers are added as a result of this endpoint, the `onNewOffers` endpoint is not invoked for this Simon.

#### Removing offers from the market

When an offer is accepted this is communicated to the offerer Simon by the `onPoolChange` endpoint.

**POST** `market/remove`. Params: `{ id, ids }`. Returns: `statuses`, where

- `id` is the `id` of the Simon that is in that simulation. This is used by the server to identify the specific simulation the state of which is queried.
- `ids` is an array of the `id`s of the offers that the Simon wants to remove
- `statuses` is an array of booleans that states whether the removal of offers[ids[i]] has been successful or not

When offers are removed as a result of this endpoint, the `onRemovedOffers` endpoint is not invoked for this Simon.

### Ecosim/Simon endpoints

These are the endpoints that the Simon provides to ecosim, so communication can be asynchronous and efficient.

#### POST `onStart`

It is the endpoint that ecosim will use to communicate the Simon that the simulation has started.

It has no params. Expects no return value.

#### POST `onRankingChange`

It is the endpoint that ecosim will use to communicate the Simon that its position in the satisfatcion chart has changed.

Params:

- `n`: number of positions changed. Positive means the Simon is doing worse, while negative means it is doing better.

#### POST `onPoolChange`

It is the endpoint that ecosim will use to communicate the Simon that its Pool has changed.

Params:

- `pool`: new state of the Simon's pool

#### POST `onNewOffers`

It is the endpoint that ecosim will use to communicate the Simon that there are new offers in the market.

Params:

- `offers`: array of the new offers in the market

#### `onRemovedOffers`

It is the endpoint that ecosim will use to communicate the Simon that there are offers that have been removed from the market.

Params:

- `ids`: array of the ids of the removed offers in the market

#### `onEnd`

It is the endpoint that ecosim will use to communicate the Simon that the simulation has ended.

Params:

- `ranking`: final ranking of this Simon. If `ranking = 1` this Simon has won.