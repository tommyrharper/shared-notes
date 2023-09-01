# 0xMacro Audit

- [x] [M-1] Early vest fees can get locked in Migrator contract
  - See new `recoverExcessFunds` and `accountForFrozenFunds` functions
- [x] [L-1] Missing zero address checks for staking contracts
- [x] [L-2] getVestingQuantity doesn’t consider duplicates
  - **Not acted upon**: Decided it is not worth the gas costs to check for duplicates.
- [ ] [L-3] balanceAtTime, escrowedbalanceAtTime, and totalSupplyAtTime can return different values for not-finalized block.
- [x] [Q-1] Use of override is not required
- [x] [Q-2] Inaccurate comment
- [x] [Q-3] Inconsistent behavior between getVestingSchedules and getAccountVestingEntryIDs
- [x] [Q-4] Import of IERC20.sol


- [x] Add `treasuryDAO` to initializer
- [x] Add `setTreasuryDAO` to EscrowMigrator
- [x] Check initializer zero address checks
- [x] remove onlyOwner check on withdrawFunds
- [x] Rename withdrawFunds
- [x] add logic for handling users who missed migration window
- [x] Test users cannot register more after the 2 week period.
- [x] Test frozen logic
- [x] Add accountForFrozenFunds to interface
- [ ] Add event for accountForFrozenFunds
- [ ] Remove `getIntegratorReward` from `StakingRewardsV2`.