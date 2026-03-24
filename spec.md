# Specification

## Summary
**Goal:** Make the group chat composer visually distinct (blue) and add a plan-gated message style (color/effect) selector for group messages, with end-to-end support for new styles.

**Planned changes:**
- Update the group chat composer (GroupConversation) so the message input textbox uses a clearly blue visual style in group chats only, leaving direct-message composer styling unchanged.
- Add group composer controls to choose message color/effect prior to sending, with plan-based availability:
  - Free/Normal: Normal only (no effects beyond None)
  - Pro: Black, Orange, Blue, Purple
  - Ultra: adds Skulls and Flames effects
  - Ultimate: adds Dodge effect
- Show locked style options as visible-but-disabled, labeled with required plan (English), and display an English toast/message when a locked option is clicked.
- Extend message styling end-to-end for group messages to support Blue and Purple colors and a lightweight Dodge effect (send/store/fetch/render), while keeping existing styles working.
- Determine the user’s plan tier (Free/Pro/Ultra/Ultimate) from existing premium membership data where possible; if needed, add backend state to the Motoko UserProfile and expose a query for the frontend to read the tier.
- Change group composer default selection behavior so group chats default to Blue and reset back to Blue after sending; direct-message defaults remain unchanged.

**User-visible outcome:** In group chats, the message box looks blue and users can pick message colors/effects before sending; higher-tier styles are shown as locked with plan labels and an explanatory message when tapped, and recipients see the selected Blue/Purple colors and Dodge effect on group messages.
