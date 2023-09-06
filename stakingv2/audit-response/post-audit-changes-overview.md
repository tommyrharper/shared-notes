# Post Audit Changes Overview

For Staking V2 we had 3 auditors reviewing the code all at the same time.

Due to this, there have been a series of changes made to the code that are beyond the scope of the feedback of what any one single auditor provided.

The purpose of this document is to provide an overview of the changes that have been based on that feedback to all of the auditors concerned.

## Branching Strategy

All auditors have been reviewing code from the `migration-script` branch.

Specifically the last commit made before going into audit is `760dc1e33175b5437075a30e7e0b1f7cc7d09b6e`.

Since then I have pushed the new changes based on the auditors feedback to the `migration-script` branch.

To make it clearer what I have changed, I have created a new branch called `pre-audit-migration-script` which is simply a fork of the commit `760dc1e33175b5437075a30e7e0b1f7cc7d09b6e` - the state of the `migration-script` branch before I pushed the changes based on the auditors feedback.

I have then updated the `migration-script` PR ("StakingV2 With New Migration Script") base branch to be `pre-audit-migration-script` instead of `main`.

This means on the PR you can look at the changes and see what exactly has changed since the code went into audit.

This may not be the ideal strategy, honestly I didn't plan it I just ended up in this situation and changing the PR base branch seemed like the easiest way to make it clear what has changed.

Please do provide feedback on what your preferred branching strategy would be in this situation form an auditors perspective? Perhaps keeping a separate branch for the changes and a PR from that branch into `migration-script`? That's probably what I would have done in retrospect.

## High Level on Major Changes

### Migration Deadline

Now the `EscrowMigrator` contract stores an `initializationTime` value for each user, which logs the time at which they first call `registerEntries`.

There is also a `MIGRATION_DEADLINE` value of 2 weeks.

Each user has a period of 2 weeks from the time they first call `registerEntries` until they must finish migrating.

If they miss that deadline, they will not be able to register any more entries, or migrate any entries that have been registered but not yet migrated.

### Fund Recovery System

A system has been put in place to ensure that all excess funds sent to the `EscrowMigrator` contract from users who either choose to vest but not migrate or who miss the deadline can be recovered.

In order to do this, two new functions have been added to the `EscrowMigrator` contract:
- `recoverExcessFunds()`
- `updateTotalLocked(address _expiredMigrator)`

#### recoverExcessFunds

Calling this function will transfer all excess funds from the `EscrowMigrator` contract to the `treasuryDAO` address, which is set in the `constructor` and also can be updated via an `onlyOwner` `setTreasuryDAO` function.

The `recoverExcessFunds` has no access control, so anyone can claim it and sweep any excess funds to the treasury any time.

#### updateTotalLocked

This function updates the new `totalLocked` storage value which tracks the amount of $KWENTA in the `EscrowMigrator` contract which is permanently "locked" due to users missing their migration deadline.

The word "locked" may be a bit misleading, because it is not actually locked in the sense that it can be withdrawn to the treasury.

But it is "locked" in the sense that the user can now never access that $KWENTA.

Calling the `updateTotalLocked` function with a given user will check if that user has any registered escrow that was not migrated due to missing the deadline, and if so increment `totalLocked` by that amount.

Then when `recoverExcessFunds` is called, it will account for the `totalLocked` value, allowing for more funds to be swept from the `EscrowMigrator` contract to the treasury.

There is also a `updateTotalLocked(address[] memory _expiredMigrators)` function to bulk update the `totalLocked` value for multiple users at once.

In theory, if we call `updateTotalLocked` with every user who missed the deadline, and then call `recoverExcessFunds`, all funds in the `EscrowMigrator` contract will be swept to the treasury (except for the total amount of registered escrow that has not been migrated yet and has not yet passed the deadline).

So due to the deadline, eventually all funds will be able to be recovered to the treasury.

Again the `updateTotalLocked` function has no access control, so anyone can call it at any time.


