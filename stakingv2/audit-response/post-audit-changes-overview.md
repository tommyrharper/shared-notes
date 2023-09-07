# Post Audit Changes Overview

For Staking V2 we had 3 auditors reviewing the code all at the same time.

Due to this, there have been a series of changes made to the code that are beyond the scope of the feedback of what any one single auditor provided.

The purpose of this document is to provide an overview of the changes that have been made based on that feedback to all of the auditors concerned.

## Branching Strategy

All auditors have been reviewing code from the `migration-script` branch.

Specifically the last commit made before going into audit was `760dc1e33175b5437075a30e7e0b1f7cc7d09b6e`.

Since then I have pushed the new changes based on the auditors feedback to the `migration-script` branch.

To make it clearer what I have changed, I have created a new branch called `pre-audit-migration-script` which is simply a fork of the commit `760dc1e33175b5437075a30e7e0b1f7cc7d09b6e` - the state of the `migration-script` branch before I pushed the changes based on the auditors feedback.

I have then updated the `migration-script` PR ([StakingV2 With New Migration Script](https://github.com/Kwenta/token/pull/232)) base branch to be `pre-audit-migration-script` instead of `main`.

This means on [the PR](https://github.com/Kwenta/token/pull/232) you can look at the changes and see what exactly has changed since the code went into audit.

This may not be the ideal strategy, honestly I didn't plan it I just ended up in this situation and changing the PR base branch seemed like the easiest way to make it clear what has changed.

Please do provide feedback on what your preferred branching strategy would be in this situation form an auditors perspective? Perhaps keeping a separate branch for the changes and a PR from that branch into `migration-script`? That's probably what I would have done in retrospect.

# High Level Major Changes

## Migration Deadline

Now the `EscrowMigrator` contract stores an `initializationTime` value for each user, which logs the time at which they first call `registerEntries`.

There is also a `MIGRATION_DEADLINE` value of 2 weeks.

Each user has a period of 2 weeks from the time they first call `registerEntries` until they must finish migrating.

If they miss that deadline, they will not be able to register or migrate any more entries.

## Fund Recovery System

A system has been put in place to ensure that all excess funds sent to the `EscrowMigrator` contract from users who either choose to vest but not migrate or who miss the deadline can be recovered.

In order to do this, two new functions have been added to the `EscrowMigrator` contract:
- `recoverExcessFunds()`
- `updateTotalLocked(address _expiredMigrator)`

### recoverExcessFunds

Calling this function will transfer all excess funds from the `EscrowMigrator` contract to the `treasuryDAO` address, which is set in the `constructor` and also can be updated via an `onlyOwner` `setTreasuryDAO` function.

The `recoverExcessFunds` is set to be an `onlyOwner` function, even though in theory it would be safe for anyone to call, it does trigger the transfer of funds and there is no reason for anyone other than Kwenta DAO to call it, so we have kept it `onlyOwner` just be extra safe.

### updateTotalLocked

This function updates the new `totalLocked` storage value which tracks the amount of $KWENTA in the `EscrowMigrator` contract which is permanently "locked" due to users missing their migration deadline.

The word "locked" may be a bit misleading, because it is not actually locked in the sense that it can be withdrawn to the treasury.

But it is "locked" in the sense that the user can now never access that $KWENTA.

Calling the `updateTotalLocked` function with a given user will check if that user has any registered escrow that was not migrated due to missing the deadline, and if so increment `totalLocked` by that amount.

Then when `recoverExcessFunds` is called, it will account for the `totalLocked` value, allowing for more funds to be swept from the `EscrowMigrator` contract to the treasury.

There is also a `updateTotalLocked(address[] memory _expiredMigrators)` function to bulk update the `totalLocked` value for multiple users at once.

In theory, if we call `updateTotalLocked` with every user who missed the deadline, and then call `recoverExcessFunds`, all funds in the `EscrowMigrator` contract will be swept to the treasury (except for the total amount of registered escrow that has not been migrated yet and has not yet passed the deadline).

So due to the deadline, eventually all funds will be able to be recovered to the treasury.

The other exception to this is in the case that a user has registered so many entries and missed the deadline that the `updateTotalLocked` function runs out of gas when trying to update the `totalLocked` value.

In this case, the `totalLocked` value will be incorrect, and the `recoverExcessFunds` function will not be able to sweep all funds to the treasury.

However I believe that this is extremely unlikely to happen. In reality probably few users will miss the deadline and the function can by my calculation handle up to `37_000` entries in one transaction (using less than 30m gas). We are not aware of any users who have `2000` entries or more, so a capacity of `37_000` is plenty.

Also the impact is low, it just means some funds (probably very little) are locked in the `EscrowMigrator` and if we really want them we could update the contract to allow us to sweep those funds.

Again the `updateTotalLocked` function has no access control, so anyone can call it at any time.

## StakingRewardsNotifier

The `EarlyVestFeeDistributor` has been renamed to `TokenDistributor` and been replaced by a new contract called `StakingRewardsNotifier`, also referred to throughout the code as the `rewardsNotifier`.

The `StakingRewardsNotifier` now takes the place of what was previous the `EarlyVestFeeDistributor`.

`SupplySchedule.stakingRewards` is set to point to the `StakingRewardsNotifier`, and the `SupplySchedule` is replaced by the `StakingRewardsNotifier` in the `StakingRewardsV2` contract.

When users vest early, the fees are sent to the `StakingRewardsNotifier`, and when `SupplySchedule.mint` is called, it calls `StakingRewardsNotifier.notifyRewardAmount`, the `StakingRewardsNotifier` then calls `StakingRewardsV2.notifyRewardAmount` with the sum of the `mintedAmount` and the early vest fees sent to to the `StakingRewardsNotifier`.

This way, the early vest fees are distributed to the stakers in the same way as newly minted rewards.

So the flow of $KWENTA to `StakingRewardsV2` looks like this:
```
SupplySchedule ----------------------------->|
                                             |--> StakingRewardsV2
RewardEscrowV2 --> StakingRewardsNotifier -->|
```

## New Deployment Strategy

Due to the above described changes, the following changes have had to be made the deployment strategy:

The following changes have been made in `Migrate.s.sol`:
- A the `deploySystem` stage:
  - `StakingRewardsNotifier` is deployed first.
  - The `StakingRewardsNotifier` address is passed to the `StakingRewardsV2` and `RewardEscrowV2` constructor.
  - The `treasuryDAO` address is passed into the `EscrowMigrator` constructor.
- At the `setupSystem` stage:
  - `rewardsNotifier.setStakingRewardsV2(_stakingRewardsV2)` is called.
- At the `migrateSystem` stage:
  - `supplySchedule.setStakingRewards` is called with the `rewardsNotifier` address.
  - `escrowMigrator.unpauseEscrowMigrator()` is called.
    - This is because we now start the `EscrowMigrator` as paused.

Due to the fact that `StakingRewardsNotifier` is now set in the `RewardEscrowV2` constructor, there is no longer a need to check that the `earlyVestFeeDistributor` is set in the vest function, as the equivalent value (`rewardsNotifier`) will always be set.

## Storage Packing

Storage packing has been applied in three new places:
1. `IEscrowMigrator.VestingEntry`
2. `IRewardEscrowV2.VestingEntry`
3. `IStakingRewardsV2.Checkpoint`

This has lead to significant gas savings.

I have checked to see if this risks any potential overflows throughout the codebase, and I did find one instance where the `IRewardEscrowV2.VestingEntry` packing lead to an overflow:
```solidity
earlyVestFee =
            (_entry.escrowAmount * _entry.earlyVestingFee * timeUntilVest) / (100 * _entry.duration);
```

Here `100 * _entry.duration` would overflow due to the initial value I set for that as `uint32`.
I then hence updated this piece of code as follows:
```
earlyVestFee = (uint256(_entry.escrowAmount) * _entry.earlyVestingFee * timeUntilVest)
            / (100 * uint256(_entry.duration));
```
The casting to `uint256` prevents the overflow. I also increased the `duration` to size `uint40` as it was possible to make it a bit larger and still fit in a single slot.

The reason I am raising this specifically here is one of my worries is there may be an overflow somewhere due to the new storage packing that I have missed. I would appreciate if any auditors take a second look at this just to double check.

## Misc Changes

There are some general smaller miscellaneous including but not limited to the following:
- `override` modifiers have been removed functions defined in interfaces.
- Various `storage` related optimizations have been applied, particularly in loops.
- Documentation updates
- Some general refactoring and optimizations

# Final Notes

I would like to thank each of the auditors for the time you have invested into helping to secure this code.

Any effort you put into reviewing these final changes will be greatly appreciated!

I hope I have fully addresses any concerns you have raised, and don't hesitate to let me know if there are any further issues.

Thanks!