# Specification

## Summary
**Goal:** Implement end-to-end 1:1 direct messaging (DMs) so authenticated users can message another user, view conversation history, and see an inbox-style chat list driven by DM activity.

**Planned changes:**
- Add Motoko canister methods in `backend/main.mo` to send a direct message and to query the full DM conversation between the caller and a specified other user, returning messages in chronological order and restricting access to participants only.
- Add a Motoko canister query method in `backend/main.mo` to return the caller’s unique DM conversation partners ordered by most recent message activity (for an inbox/chat list).
- Implement `useSendMessage` and `useGetMessagesWithUser` in `frontend/src/hooks/useQueries.ts` to call the new backend DM APIs and update the chat UI so sent messages appear quickly (optimistic update or immediate refetch) and new incoming messages appear via polling/refetch without a full page reload.
- Update the Chats page sidebar to use the backend DM inbox/chat list as its data source while keeping the existing search filter behavior and ensuring selecting a user opens the correct 1:1 conversation.

**User-visible outcome:** Users can send and receive 1:1 direct messages, browse their DM threads from a chat list ordered by recent activity (even without followers/following), and see new messages appear in the conversation without manually refreshing the page.
