# Omniscia Audit

## REV-01S: Inexistent Sanitization of Input Addresses

- Done

## SRV-01S: Inexistent Sanitization of Input Addresses

- Done

## REV-01M: Improper Bulk Transfer to Self

- Done

## REV-02M: Discrepant Handling of Fees

- Done

## REV-01C: Duplicate Initialization of Dependency

- Done

## REV-02C: Improper Comparison of Values

- Done

## REV-03C: Ineffectual Usage of Safe Arithmetics

- Done

## REV-04C: Inefficient Pointer Location

- Done

## REV-05C: Inefficient Transfer of Ownership

- Done

## REV-06C: Inefficient mapping Lookups

- Done

## REV-07C: Loop Iterator Optimization

- Deciding not to do this optimization as it requires two unchecked operations, one at the end of the for loop and one in the continue if block to avoid infinite loops occurring. This makes the code less readable and makes it more likely for a mistake to made by a future developer doing an upgrade.

## REV-08C: Potential Enhancement of Error Handling

- Done

## REV-09C: Redundant Getter Function

- Done

## REV-10C: Redundant Type Castings

- Done

## REV-11C: Repetitive Value Literals

- The other instance of `MAXIMUM_EARLY_VESTING_FEE` being used, where it is set as 100, does not have semantically the same meaning as `MAXIMUM_EARLY_VESTING_FEE`. In this instance the meaning of `100` is "100 percent". However the `MAXIMUM_EARLY_VESTING_FEE` could be set to say `90` in a future upgrade, and the 100 would still remain the same as "100 percent".

## REV-12C: Variable Mutability Specifier (Immutable)

- Done

## SRV-01C: Generic Typographic Mistakes

- Done

## SRV-02C: Ineffectual Usage of Safe Arithmetics

- Done

## SRV-03C: Inefficient Transfer of Ownership

- Done

## SRV-04C: Inefficient mapping Lookups

- Done

## SRV-05C: Potential Error Enhancement

- Done

## SRV-06C: Redundant Parenthesis Statement

- Done

## SRV-07C: Suboptimal Struct Declaration Style

- Done

## SRV-08C: Variable Mutability Specifiers (Immutable)

- Done
