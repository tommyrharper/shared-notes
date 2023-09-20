# Staking V2

Staking V2 is now complete, this documents provides an overview of the changes.

## Optimism Goerli Testnet Deployment

- RewardEscrowV2 Implementation: 0x0A34aee61770b3cE293Fb17CfC9d4a7F70945260
- RewardEscrowV2 Proxy: 0xf211F298C6985fF4cF6f9488e065292B818163F8
- StakingRewardsV2 Implementation: 0xE0aD43191312D6220DE64aFA54dbdD6982991A87
- StakingRewardsV2 Proxy: 0x3e5371D909Bf1996c95e9D179b0Bc91C26fb1279

## Mainnet Deployment

- RewardEscrowV2 Implementation: 0xF877315CfC91E69e7f4c308ec312cf91D66a095F
- RewardEscrowV2 Proxy: 0xd5fE5beAa04270B32f81Bf161768c44DF9880D11
- StakingRewardsV2 Implementation: 0x33B725a1B2dE9178121D423D2A1c062C5452f310
- StakingRewardsV2 Proxy: 0xe5bB889B1f0B6B4B7384Bd19cbb37adBDDa941a6
- EscrowMigrator Implementation: 0x10B04483d762Bd4F193F35600112ad52391004A7
- EscrowMigrator Proxy: 0xC9aF789Ae606F69cF8Ed073A04eC92f2354b027d
- StakingRewardsNotifier: 0x03f6dC6e616AB3a367a1F2C26B8Bc146f632b451

# New Features and Changes

## Unstaking Cooldown Period

There is now an unstaking cooldown period for v2. This is set to 2 weeks by default, but can be changed by the admin.
- During the cooldown period it is not possible to unstake.
  - The exception to this is when vesting - staked escrow will bypass the cooldown period when vesting.
- Once the cooldown period has passed, the user can then unstake.
- Every time a user stakes (any amount) the cooldown timer is reset.
- The following functions are effected by the cooldown:
  - `StakingRewardsV2.userLastStakeTime(address user)`
  - `StakingRewardsV2.unstake(uint256 amount)`
  - `RewardEscrowV2.unstakeEscrow(address account, uint256 amount)`
  - `RewardEscrowV2.transferFrom(address from, address to, uint256 tokenId)`
    - The reason the `transferFrom` is affecting is that escrow entries cannot be transferred unless they are unstaked.

The unstaking cooldown period has been added to allow staked balances to be able to be used securely for on-chain voting.

## V2 Escrow Entries are now ERC721 Tokens (NFTs)

This means it is now possible to transfer escrow entries.
- `RewardEscrowV2.transferFrom(address from, address to, uint256 tokenId)`
- `RewardEscrowV2.bulkTransferFrom(address from, address to, uint256[] calldata entryIDs)`

Each NFT has the following metadata:
```solidity
struct VestingEntry {
    uint256 escrowAmount; // how much kwenta is escrowed
    uint256 duration; // how long the vesting period is
    uint64 endTime; // when the vesting period ends
    uint8 earlyVestingFee; // the % fee to pay if the user wants to vest early (reduces over time)
}
```

There are a few things to be aware of:
1. If the user wants to transfer an escrow entry, they must have sufficient unstaked escrow before transferring.
   - This means if all of their escrow is staked, they will first have to unstake some of it before transferring an entry.
     - Users won't be able to do this during the cooldown period.
2. The `RewardEscrowV2.balanceOf` function has a different meaning to the V1 `RewardEscrow.balanceOf` function.
   - In v1 `balanceOf` meant a users total amount of escrowed balance.
   - In v2 `balanceOf` means the number of NFTs/escrow entries a user has. This is because of the ERC721 standard.
     - In v2 the to get a users total escrowed balance you must use `RewardEscrowV2.escrowedBalanceOf(address account)`
3. The escrow entry NFTs will burnt when vested.

This unlocks all the following functions for escrow entries:
```solidity
RewardEscrowV2.safeTransferFrom(address from, address to, uint256 tokenId)
RewardEscrowV2.transferFrom(address from, address to, uint256 tokenId)
RewardEscrowV2.bulkTransferFrom(address from, address to, uint256[] calldata entryIDs)
RewardEscrowV2.balanceOf(address account)
RewardEscrowV2.ownerOf(uint256 tokenId)
RewardEscrowV2.approve(address to, uint256 tokenId)
RewardEscrowV2.getApproved(uint256 tokenId)
RewardEscrowV2.setApprovalForAll(address operator, bool approved)
RewardEscrowV2.isApprovedForAll(address owner, address operator)
RewardEscrowV2.totalSupply()
RewardEscrowV2.tokenOfOwnerByIndex(address owner, uint256 index)
RewardEscrowV2.tokenByIndex(uint256 index)
```

## Historical values (checkpointing)

It is now possible to query historical staking values on the `StakingRewardsV2` contract.

This could be used for a cool dashboard with a graph of different staked values over time.

- This adds the following new functions:
  - `StakingRewardsV2.balanceAtTime(address account, uint256 _timestamp)`
  - `StakingRewardsV2.escrowedbalanceAtTime(address account, uint256 _timestamp)`
  - `StakingRewardsV2.totalSupplyAtTime(uint256 _timestamp)`

## Delegation

Users now have the ability to delegate the ability to claim rewards and stake escrow.

- This adds the following the new functions:
  - `StakingRewardsV2.approveOperator(address operator, bool approved)`
  - `StakingRewardsV2.stakeEscrowOnBehalf(address account, uint256 amount)`
  - `StakingRewardsV2.getRewardOnBehalf(address account)`
  - `StakingRewardsV2.compoundOnBehalf(address account)`

## Compounding

Previously users wanting to maximize their staking returns had to repeatedly claim and stake their rewards in two separate transactions. This was a pain for users and also caused a lot of unnecessary transactions on the network and gas costs.

Hence we have added a new `compound` function that allows users to claim and stake those rewards in one transaction. This is also available for delegation.
- `StakingRewardsV2.compound()`
- `StakingRewardsV2.compoundOnBehalf(address account)`

## New Admin Features

- Ability to set a cooldown period
  - `StakingRewardsV2.setCooldownPeriod(uint256 _cooldownPeriod)`

## Summary

The new front-end will need to support both v1 and v2, and will need to have a UX that explains the difference between the two, encourages users to migrate to v2.

Nearly full functionality will need to be supported for V1 - the only thing that we may want to remove is the ability to stake, as we want to discourage further staking on V1.

StakingV2 front-end functionality should reach at least V1 parity by the time of release, but ideally we would like to also support the following new functionality:
- Explanation of and visibility into cooldown system.
- Ability to transfer and bulk transfer escrow entries and all other associated NFT functionality (approvals etc.)
- Delegation of the ability to claim rewards and stake escrow.
- Some cool use of historical values (checkpointing) - maybe a graph of different staked values over time.
- Ability to compound rewards in a single transaction using the new `compound` function.
