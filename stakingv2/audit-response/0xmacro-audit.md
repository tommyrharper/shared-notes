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
- [x] [Q-5] Missing natspec param description in constructors
- [x] [Q-6] escrowedbalanceAtTime incorrectly spelled according to naming convention
- [x] [G-1] Tracking block number in Checkpoint struct is not necessarily needed
  - **Not acted upon**: We want to keep it in case we need it in the future, however we have adapted the `Checkpoint` struct to fit into a single storage slot to make the gas impact negligible.
