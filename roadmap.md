# UI redesign
- [x] Apply consistent soft-blue design and static character presentation.
- [x] Add shared bottom navigation and expand page layouts without changing chat logic.
- [x] Verify mobile and desktop navigation, chat, and interpretation.

# CLOVA chat connection
- [x] Connect Cloud and securely collect the CLOVA signing key.
- [x] Replace normal chat mock replies with signed CLOVA requests and recoverable errors.
- [x] Verify signed provider requests and desktop/mobile error/retry flow; preserve interpretation and appearance (6 tests passed).
- [x] Verify a successful conversational answer (send only the user question; CLOVA rejects long prompts).
# Pet app pivot
- [x] Remove human-message interpretation; pet wording.
- [ ] Chat with mood + suggested questions (1,3,4)
- [ ] Behavior/sound interpretation (2,6)
- [ ] Profile, archive, diary, growth (13-16)
- [ ] Letter, play, snack, routine, dress-up, situations, intimacy, fortune, collection (5,7-12,17,18)
