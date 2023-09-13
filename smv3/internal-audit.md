# Smart Margin V3

## [M-01] Nonce has to be unique for each conditional order

As each nonce needs to be unique for each conditional order, it is possible there could be nonce collisions causing orders to fail, for orders that are submitted around the same time.

Another option could be to store the nonces per `accountId`.

## [N-01] Missing Natspec

In the `Engine` constructor it is missing the natspec for the `_oracle` param in constructor.

## [N-02] Override no longer needed

Currently `override`  is specified on all the interface functions. Since the latest versions of solidity this can now be removed, making the contract cleaner and easier to read.

## Questions

- Wy is `MAX_CONDITIONS` limited to 8?
- How does `PERPS_MARKET_PROXY.hasPermission` work in synthetix v3?
