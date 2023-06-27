# stakingv2-nfts System Internal Audit

I have ticked off bits I have done/responded too. My responses are bullet points under each issue and have been bolded to make them easier to pick out.

Reference:
- https://gov.kwenta.eth.limo/kips/kip-058/
- https://gov.kwenta.eth.limo/kips/kip-077/
- https://gov.kwenta.eth.limo/kips/kip-075/

## Issues

### Low severity
- [x] L1: setRewardsDuration
notifyRewardAmount() performs a division by rewardsDuration which can be set to zero in setRewardsDuration. Consider adding nonzero check. After this fix, the else block can be unchecked{}. (Unrelated, a lot of the arithmetic in this contract *can* be unchecked… just a question of whether or not it is worth it as it reduces clarity imo)

- [x] L2: `super._transfer` in `bulkTransferFrom`
`super._transfer()` is called but `RewardEscrowV2`'s overridden`_transfer()` should be called. Once this change is made, the internal call to `_applyTransferBalanceUpdates()` that happens after the for-loop should be removed (as it is called in `RewardEscrowV2`'s overridden`_transfer()` already).
    - **As explained in our conversation, this is an intentional gas optimization to save querying the `StakingRewardsV2` contract in each iteration. I have added som comments to explain this.**

### Code Quality
- [x] CQ1: Wasteful checks for staked escrow $KWENTA in `vest`
In the event `vest` is called and `total` is non-zero, the code immediately:

1. establishes the staked balance
2. checks if it is non-zero
3. *then* checks the non-staked escrow balance
<br>
If the non-staked escrow balance is less than the `totalWithFee` then staked escrowed $KWENTA is unstaked. 
<br><br>
Why not first check if non-staked escrow balance is greater than `totalWithFee` first to potentially avoid executing steps (1) and (2)? In the case that non-staked escrow balance is less than `totalWithFee`, the following logic would match what was done above (i.e. worst case same gas is spent)

## Questions
- [x] Q1: Reentrancy in Stake/Unstake
Given that we are interacting with $KWENTA and not some unknown token, is it necessary to have reentrancy guards on several of the functions? (i.e. stake, unstake, _unstakeEscrow, _getReward, etc)
     - **I have changed this to remove the reentrancy guards**

- [x] Q2: Library defined struct
StakingRewardsV2 defines relevant structs in the interface. However, RewardEscrowV2 defines structs within a library. Why was this decision made?
    - **I have moved the structs to the interface, I had just copied this code from V1**

- [x] Q3: $KWENTA balance < totalEscrowBalance
When would the condition checked for [here](https://github.com/Kwenta/token/blob/b4cc13f2bf71d2ee363d1c10815fa86ec8f1b48b/contracts/RewardEscrowV2.sol#L442) ever return true? Is this check necessary? This is more of an invariant vs a check that needs to exist in contract logic. 
> If this ever returns true, contract state has been manipulated and the contract is likely compromised

   - **You are correct, I have updated this to use `assert` to emphasize that it is an invariant. I thought about removing the check to save gas, but reflecting on the tradeoff between a small gas saving and the protection against a potential unforeseen exploit, I think it is worth keeping.**
## Gas Optimizations
- [x] G1: _addBalancesCheckpoint
```
uint256 lastTimestamp = balances[_account].length == 0
  ? 0
  : balances[_account][balances[_account].length - 1].ts;
```
At minimum, one SLOAD is used. Typically, three SLOAD opcodes will be used if length is non-zero. Consider storing balances[_account] in memory. Should save ~200 gas since last two reads are from a warm slot.

- [x] G2: _addEscrowedBalancesCheckpoint
```
uint256 lastTimestamp = escrowedBalances[_account].length == 0
  ? 0
  : escrowedBalances[_account][escrowedBalances[_account].length - 1].ts;
```
At minimum, one SLOAD is used. Typically, three SLOAD opcodes will be used if length is non-zero. Consider storing escrowedBalances[_account] in memory. Should save ~200 gas since last two reads are from a warm slot.

- [x] G3: _addTotalSupplyCheckpoint
```
uint256 lastTimestamp =
  _totalSupply.length == 0 ? 0 : _totalSupply[_totalSupply.length - 1].ts;
```
At minimum, one SLOAD is used. Typically, three SLOAD opcodes will be used if length is non-zero. Consider storing _totalSupply in memory. Should save ~200 gas since last two reads are from a warm slot.

- [x] G4: `vest` for-loop
Here you do not increment `i` like you did elsewhere (i.e. unchecked)
https://github.com/Kwenta/token/blob/b4cc13f2bf71d2ee363d1c10815fa86ec8f1b48b/contracts/RewardEscrowV2.sol#L307
    - **This is intentional, as due to the `continue` branch, if `i` is incremented at the end of the loop, the continue block will path will not increment `i` and an infinite loop will be created.**

- [x] G5: unchecked increment in `_mint`
this can be unchecked
https://github.com/Kwenta/token/blob/b4cc13f2bf71d2ee363d1c10815fa86ec8f1b48b/contracts/RewardEscrowV2.sol#L459

## Nitpicking
- [x] NIT1: Spelling
Spelling error: stake -> staked: https://github.com/Kwenta/token/blob/f7a766729a08a62ae10f77ed4a22d7a453b311f2/contracts/StakingRewardsV2.sol#L55

- [x] NIT2: Spelling
Spelling error: stake -> staker: https://github.com/Kwenta/token/blob/f7a766729a08a62ae10f77ed4a22d7a453b311f2/contracts/StakingRewardsV2.sol#L83

- [x] NIT3: recoverERC20
Generally not a fan of `recoverERC20` type functions but omitting it is up to author
    - **I'm going to leave it as it is already implemented, but will consider this in future and I understand your general principle.**

- [x] NIT4: Not a CONSTANT/IMMUTABLE
`kwenta` is not a constant/immutable https://github.com/Kwenta/token/blob/b4cc13f2bf71d2ee363d1c10815fa86ec8f1b48b/contracts/RewardEscrowV2.sol#L46

- [x] NIT5: Not a CONSTANT/IMMUTABLE
`stakingRewards` is not a constant/immutable
https://github.com/Kwenta/token/blob/b4cc13f2bf71d2ee363d1c10815fa86ec8f1b48b/contracts/RewardEscrowV2.sol#L49

- [x] NIT6: Immutables
`kwenta`, `stakingRewards`, and `treasuryDAO` are not immutable. The contract is upgradable and these addresses are unlikely to change *often* so making them immutable would save a lot of gas.

  - **Not sure how to do this while using the UUPS proxy pattern. For the values that do not change at all (i.e. kwenta) I could set the addresses as constants though.**
## Guidlines

### High
> This issue can take the entire project down. Ownership can get hacked, funds can get stolen, bad actors can grief everyone else, these sorts of things.

### Medium
> There's some large potential risk, but it's not obvious whether the issue will actually happen in practice.

### Low	
> A small amount of risk, perhaps unlikely, perhaps not relevant, but notable nonetheless.

### Code Quality	
No obvious risk, but fixing it improves code quality, better conforms to standards, and ultimately may reduce unperceived risk in the future.