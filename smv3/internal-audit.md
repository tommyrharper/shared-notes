# Smart Margin V3

## To look into

- `_updateAccountStats` says `@dev only callable by a validated margin engine`. However it is called in `_commitOrder`, which in turn is called in `execute` and `commitOrder`.
  - `commitOrder` uses the following validation: `isAccountOwner(_accountId, msg.sender) || isAccountDelegate(_accountId, msg.sender)`
  - If the contract calls itself with `multicall`, it seems this check could pass for any caller and any user as `isAccountDelegate` would always be true for `msg.sender` if `msg.sender` is the contract itself, which has admin rights over all accounts.


## [L-01] Nonce has to be unique for each conditional order

As each nonce needs to be unique for each conditional order, it is possible there could be nonce collisions causing orders to fail, for orders that are submitted around the same time.

Another option could be to store the nonces per `accountId`.

## [N-01] Missing Natspec

In the `Engine` constructor it is missing the natspec for the `_oracle` param in constructor.

## [N-02] Override no longer needed

Currently `override`  is specified on all the interface functions. Since the latest versions of solidity this can now be removed, making the contract cleaner and easier to read.

## [N-03] Transfer to `Engine` is not needed when depositing collateral

In the `_depositCollateral` function, the user must first approve the `Engine`, then it transfers the synth to the Engine, before approving `PERPS_MARKET_PROXY` and then calling `PERPS_MARKET_PROXY.modifyCollateral`.

Instead a user could simply approve `PERPS_MARKET_PROXY` and call

## Questions

- Wy is `MAX_CONDITIONS` limited to 5?
- In the `Engine.createAccount` function, where are admin rights provided to the `Engine` over the users account?
- How does `PERPS_MARKET_PROXY.hasPermission` work in synthetix v3?
