# Ecosim
Economic simulator

## Introduction

Ecosim is a market system simulator where different AIs compete to get the most resources. This README corresponds to the server where the simulation takes place. This server offers a REST API to external systems that can implemente the AI. A dashboard detailing the results of the simulation is also provided here.

The communication model of ecosim is server-server. Ecosim is a server, and it communicates with other servers representing the AIs of the agents.

### Contents

This repository contains
- The website of the Ecosim project
- The Ecosim npm module
- [The Ecosim Simulation server](https://github.com/carlosvpi/ecosim/blob/master/ecosim-server/README.md)
  - Including its own web
- An example of an ecosim User server
  - Including its own web

### Definitions

Different economic resource types are represented by *resource types* (which are integers), and instances of resource types are called *resources*. The agents in the system are small AIs that have to maximize their satisfaction, which is a function of the orbs they possess.

A recipe is a pair represented by (A ~> B), where A and B are *multisets* of elements, expresses that A can be transformed into B in some circumstance. In other words, if *m* U *n* is a multiset of elements, then (m ~> p)(m U n) = *p* U *n*.

### Global values of the simulation

An ecosim simulation includes the following values:

- set of recipes R, called *global recipes* G. R is static and determined at the beginning of the simulation
- set of recipes M, called *market*. M is dynamic.

### The Agents

An agent is a cuadruple (P, S, O, i), where:

- P: Multiset(element) is the pool of resources that the agent owns. It is initialized to the emptyset
- S: Multiset(element) -> Real, is a satisfaction function. This function is random and private; the idea is that the AI of the agent must be able to adapt to whatever function it is given. However, the following property hold:
  - S(m U n) ≥ S(m) + S(n)
- O: set(recipe), the offers this agent has written in the market.
- i: a recipe from the global recipes that this agent applies every time it can. If *i* is `null`, this means this agent doesn't want to perform any global recipe this cycle.

The goal of an agent (P, S, O, i) is to maximize S(P) in the end of the simulation.

### Simulation time

Ecosim works in real time. A cycle is the time (in ms) that ecosim allows the agents apply a global recipe. This is, every cycle, each agent (P, S, O, i != `null`) is rewritten as (G[i](P), S, O, i).

The duration of the simulation is secret; this is so to better represent the real world, where no agent knows when its own end is going to come. Each simulation has a different duration.

### Parameters of the simulation

The parameters of each ecosim simulation are:

- the number of resource types (|E|)
- the number of global recipes (|R|)
- the number of agents participating in the simulation (|A|)
- the cycle duration (in ms)
- the number of cycles the simulation will last
