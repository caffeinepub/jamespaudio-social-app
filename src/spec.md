# Specification

## Summary
**Goal:** Add a clearly labeled “Web Search Ultra (Coming Soon)” option to the Advanced Search Engine results UI as a UI-only future feature.

**Planned changes:**
- Update `frontend/src/pages/SearchEnginePage.tsx` to include a new “Web Search Ultra” tab in the results tab row when a search has been submitted, visibly marked as “Coming Soon”.
- Add a non-functional placeholder view for the Web Search Ultra tab that explains (in accurate English) that public web/news search is coming soon and does not perform any backend/external calls.
- Add a user action in the placeholder (e.g., button) that, when clicked, shows a clear “Coming Soon” toast/message.

**User-visible outcome:** After running a search, users see a new “Web Search Ultra (Coming Soon)” tab; selecting it shows an informational coming-soon state, and attempting to use it shows a “Coming Soon” message.
