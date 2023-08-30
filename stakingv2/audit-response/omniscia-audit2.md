# Omniscia Audit 2

- [x] EMR-01S: Inexistent Sanitization of Input Addresses
- [x] EMR-01M: Potential Enhancement of Functionality
  - **Not acted upon**: Identified as non-issue.
- [x] EMR-02M: Inexistent Sanitization of Array Length
  - Choosing not to change.
- [x] EMR-03M: Improper Deployment Methodology
- [x] EMR-04M: Inexistent Application of Checks-Effects-Interactions
- [x] EMR-05M: Overly Restrictive Pre-Condition
  - **Not acted upon**: Identified as non-issue.
- [x] REV-01M: Truncation of Transferred Amounts
- [x] REV-02M: Incorrect Introduction of Variable
  - **Not acted upon**: Identified as non-issue.
- [x] SRV-01M: Inexistent Reset of Rewards
  - **Not acted upon**: Identified as non-issue.
- [x] EVF-01C: Inexplicable Value Literals
- [x] EMR-01C: Inefficient mapping Lookups
- [x] EMR-02C: Inexplicable Value Literal
  - **Not acted upon**: Identified as non-issue.
- [x] EMR-03C: Loop Iterator Optimizations
  - **Semi-acted upon**: Optimization applied everywhere except `_migrateEntries` and `_registerEntries`, due to the `continue` statements it makes the code convoluted to read with multiple unchecked operations.
- [ ] EMR-04C: Potential Enhancements of Contract's Functionality: https://omniscia.io/reports/kwenta-staking-v2-w-migrators-64e48aba18c4480014cf4897/code-style/EscrowMigrator-EMR#span-idemr-04cemr-04c-potential-enhancements-of-contracts-functionalityspan
- [x] EMR-05C: Significant Optimization of Contract's Storage
- [x] EMR-06C: Worst Case Optimization of Getter Function
- [x] REV-01C: Generic Typographic Mistake


