# UI redesign
- [x] Apply consistent soft-blue design and static character presentation.
- [x] Add shared bottom navigation and expand page layouts without changing chat logic.
- [x] Verify mobile and desktop navigation, chat, and interpretation.

# CLOVA chat connection
- [x] Connect Cloud and securely collect the CLOVA signing key.
- [x] Replace normal chat mock replies with signed CLOVA requests and recoverable errors.
- [x] Verify signed provider requests and desktop/mobile error/retry flow; preserve interpretation and appearance (6 tests passed).
- [ ] Verify a successful conversational answer — blocked by CLOVA returning its own system-error reply; builder learning/deployment settings need checking.