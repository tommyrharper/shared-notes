# Notes

## V2

V2 is on Ethereum and Optimistic Ethereum

## V3

LPs can delegate collateral to liquidity pools, and then take out a loan of snxUSD stablecoins. This is effectively a collateralized debt position - similar to on [Liquity](https://www.liquity.org/).

Liquidity pool managers can configure pools to extend credit to derivatives markets.

These markets use Chainlink and Pyth as price oracles, allow the creation of synthetic assets known as synths.

These synthetic assets track the price of the underlying asset via the given decentralised price oracle.

By offering credit to these markets, the pools collect fees (via order fees and liquidations).

These fees reduce the debt of liquidity providers positions, incentivising depositing liquidity into pools.

## The Two Types of Synthetic Assets

The two types of synths are:
1. Perpetual Futures
2. Spot Synths

### Perpetual Futures

Similar to how liquidity pools in uniswap are the counterparty to any swaps, the SNX debt pool is the counterparty to any derivate positions.

While in uniswap the main risk for LPs is impermanent loss, in the SNX debt pool the main risk is the market skew.

If the market is skewed, that means the debt pool is taking a directional position on a given synthetic asset.

In this scenario the debt pool can lose money if the market moves against the direction of the market skew.

The goal of the debt pool is to be delta neutral (this means unaffected by the price movement of any given asset), and this is only true for a given synthetix market if its skew is zero.

Hence there is an incentivisation mechanism for markets to continually move towards 0 market skew.

This is called the funding rate, which will be explained in more depth later.

For now though you can just think of it as meaning that the heavier side of the market pays a continual fee to the lighter side of the market to encourage a neutral balance.

This allows the debt-pool to take the other side of leverage long and short positions, allowing derivatives trading on-chain.

## The Debt Pool

Anyone can enter the debt pool by purchasing and staking SNX tokens.

### Spot Synths

Spot Synths are simply assets that track the value of real-assets via a price oracle.

This allows the minting on-chain of essentially any asset that has a price oracle feed.

In this way gold, silver, stocks, bitcoin, and any other asset can be minted on-chain and integrated into the composable nature of DeFi.

### Governance

Governed by DAOs:
- Spartan Council
  - Votes on upgrades and configuration changes (SIP/SCCPs)
- Grants Council
- Ambassador Council
- Treasury Council

- Voting
  - Stake SNX
  - Vote on the Synthetix Governance Module (every 4 months)

## Synthetix V3 Changes

- Synthetix v2 is one configuration of what Synthetix v3 is capable of
- Synthetix v3 is a generalized version of v2; a toolkit for creating a wide range of DeFi protocols and more
- Synthetix v2 is a product, Synthetix v3 is the platform
- Synthetix v2 can be thought of as a narrow application of Synthetix v3
- Synthetix v3 is the collection of lego pieces, v2 is just one of the things you can create

### Components

- Pools
  - A collection of collateral connected to one or more markets.
- Oracle Manager
  - Agnostically accepts a range of on-chain and off-chain oracle prices
- Markets
  - Interacts with Pools, Oracle Managers and the rest of defi to perform a function (e.g. a game, insurance market, perpetual futures)
  - A profitable market overtime deposits more stables into the pool than it withdraws
- Rewards Distributors
  - Can be used by pool owners to bootstrap or incentivise liquidity independent of market performance (how much stable coins the market deposits to the pool).

The vision is to make the creation and management of components permissionless, meaning anyone can create and administer them on any EVM compatible chain and create just about any defi product based upon these fundamental parts.

## Overview

Currently Synthetix V3 is in alpha and is not fully operational, but is set to take over Synthetix V2 as one of the most popular protocols in all of crypto.

As you can see Synthetix V2 is currently generating ~ $40k in fees per day, as the 8th largest fee generating protocol in crypto.

![](2023-09-16-20-52-00.png)

This is mostly due to the popularity of perps (otherwise known as perpetual futures) - a derivatives trading product that allows traders to take leveraged long and short positions on any given asset.

Synthetix V3 is a generalized version of Synthetix V2, and is a toolkit for creating a wide range of DeFi protocols and more.

Synthetix V2 can be thought of as a narrow application of Synthetix V3.

## Other new features

- Cross-margin
- Cannon proxy system
- multi-collateral
- Improved events
- Improved delegation and hence automation

## Not yet released

- Rewards Distributed
- Perps on V3
- Markets are not yet deployed - hence no incentive to move over from V2 yet
- Plans to shift inflation towards V3 as a migration incentive

## v3GM



## Questions

- Can a market plug into multiple pools?
  - Yes, there is a many-to-many relationship between them.
