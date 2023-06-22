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

- Unclear what you want changing in this instance.

## REV-12C: Variable Mutability Specifier (Immutable)

- Cannot set value set in initializer to immutable.


