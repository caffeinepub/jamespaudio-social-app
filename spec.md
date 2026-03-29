# JAMESPaudio

## Current State
Full social platform with: feed, chats, groups, search, music, videos, movies, radio, AI song generator, live TV, live streams, creator studio, published apps, members only, daily rewards, daily items secret, search engine (Pro-only), search engine store, shines (currency), help, settings, robux simulator, phone protection, what's new, what's next, games coming soon.

Settings page has audio/voice settings only. No AI chatbot page. No Package Fixer page. No VIP trial section. No Google Play/Chrome badges. No NEW tags on settings. Login page exists.

## Requested Changes (Diff)

### Add
- AI Chatbot page (AIChatbotPage.tsx): chat UI with AI assistant, inline calculator panel, simple recharts graph, voice input/output via Web Speech API, tool buttons (Math Solver, Unit Converter, Currency Converter). Mock intelligent responses. Nav label "AI Chatbot", Bot icon, yellow NEW badge.
- Package Fixer AI page (PackageFixerPage.tsx): chat box, file upload (.zip/.json/.txt/.js/.ts etc), Fix File and Build File buttons with mock progress, download result button (creates mock result), "More tools coming soon" note. Nav label "Package Fixer AI", Wrench icon, yellow NEW badge.
- VIP page (VIPPage.tsx): "Try VIP Free for 6 Days" card + "Pay for 7 Months" plan card. Nav label "VIP Membership", Crown icon, yellow NEW badge.
- Google Play / Chrome coming soon badges: greyed-out store badge section in SettingsPage and WelcomePage.
- NEW yellow tags on settings: add Notification Settings card, Privacy Settings card, Theme Preferences card to SettingsPage - each with yellow "NEW" badge next to title.
- Multiple search engines in SearchEnginePage: tabs/selector for JAMESPaudio Search, Google, Bing, DuckDuckGo, YouTube. Show NEW badge on selector. External engines show disclaimer.
- App Search tab in SearchPage: add "App Search" tab with demo apps list + filtering. Show NEW badge on App Search tab.
- Login page branding: add logo/tagline area, "More sign-in options coming soon" text below form.

### Modify
- MainApp.tsx: add routes for ai-chatbot, package-fixer, vip pages. Add isNew flag to new nav items and render yellow NEW badge in NavContent.

### Remove
- Nothing.

## Implementation Plan
1. Update MainApp.tsx - add page types, imports, nav items with isNew flag, NEW badge rendering in NavContent
2. Create AIChatbotPage.tsx
3. Create PackageFixerPage.tsx
4. Create VIPPage.tsx
5. Update SettingsPage.tsx - add NEW-tagged setting cards + store badges
6. Update SearchEnginePage.tsx - add engine selector with NEW badge
7. Update SearchPage.tsx - add App Search tab with NEW badge
8. Update LoginPage.tsx - improved branding
9. Validate and fix all errors
