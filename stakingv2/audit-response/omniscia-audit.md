# Omniscia Audit

## REV-01S: Inexistent Sanitization of Input Addresses

- A zero-value check on `_contractOwner` before calling `transferOwnership` is not necessary as the `transferOwnership` function already performs this check:
```solidity
function transferOwnership(address newOwner) public virtual onlyOwner {
    require(newOwner != address(0), "Ownable: new owner is the zero address");
    _transferOwnership(newOwner);
}
```
- I have added a zero address check for the `_kwenta` address.
- I had added test cases for both of these checks.

## SRV-01S: Inexistent Sanitization of Input Addresses

- I have added zero value address checks for all values except `_contractOwner` based on same reasoning as above.