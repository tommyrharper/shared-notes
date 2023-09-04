# Guhu Audit

## My Changes

- [x] [C-01] Checkpoint Views Denial of Service Due to Quadratic Memory Expansion Costs
- [x] [H-01] Unbounded Migration Timeline Provides a Free Perpetual Call Option	
  - See new `recoverExcessFunds` and `accountForFrozenFunds` functions, along with the `DeadlinePassed` check.
- [x] [M-01] Incorrect Reporting of Claimable Amounts Due to Vested Entries
- [x] [L-01] Inefficient Storage Usage in EscrowMigrator Limiting Migration Methods
  - **Acted upon**: Optimization applied for `IEscrowMigrator.VestingEntry` packing.
  - **Not acted upon**: I did not want to set `escrowAmount` to 0, so that we still have access to that value afterwards.
- [x] [N-01] Code Duplication Across Checkpointing Functions
- [x] [N-02] Potential Token Dust Due to Rounding in RewardEscrowV2 [Previously Known Issue]
- [x] [N-03] Unused Code
  - **Acted upon**: `stakingRewardsV1` removed from the `EscrowMigrator` contract.
  - **Not acted upon**: We decided to keep the `block.number` in the `Checkpoint` struct in case we need it in the future. We have however used packing to reduce the gas impact of this.
- [x] [N-04] Documentation Improvements
- [x] [N-05] Potential Cooldown Avoidance Through Community Liquid Staking Vaults
  - **Not acted upon**: Don't have a viable solution to this problem at the moment.

## Left to Andrew/Monte

- [x] [H-02] EarlyVestFeeDistributor Can Be Simplified to Reduce Risk and System Overhead
  - **Acted upon**: Acted upon: `StakingRewardsNotifier` is implemented.
- [x] [L-02] Fee Rewards Distribution Fairness Concerns
  - **Not acted upon**: Previously known and viewed as an acceptable solution, at least for now. Also currently mitigated by switch to `StakingRewardsNotifier`.
- [x] [L-03] Epoch 0 Rewards Unclaimability [Previously Known Issue]
  - **Not acted upon**: Some debate within the team about this issue, and your approach versus the wait 1 week approach. We have decided not to bother changing it at the moment as we have followed your recommendation to use `StakingRewardsNotifier` instead.
- [x] [N-03] Unused Code - `daysToOffsetBy` issue
  - **Not acted upon**: Since `TokenDistributor` is now being postponed for use in the future, the offset will likely be used then.
