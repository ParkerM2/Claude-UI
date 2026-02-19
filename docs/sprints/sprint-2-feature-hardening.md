# Sprint 2: Feature Hardening (Non-Core)

**Goal:** Harden all the features that aren't part of the core install → task pipeline. These are the personal productivity, metrics, health, and management features. Many may get feature-flagged or hidden until they're fully fleshed out.

**Status:** NOT STARTED

---

## Focus Areas

### 1. Ideation & Brainstorming
- [ ] Ideation board create/edit/view/manage states
- [ ] Idea capture and categorization
- [ ] Idea → Task promotion flow
- [ ] Determine: keep, feature-flag, or redesign

### 2. Roadmap & Planning
- [ ] Roadmap view with timeline
- [ ] Milestone tracking
- [ ] Roadmap ↔ Project association
- [ ] Edit/view/manage states for roadmap items
- [ ] Determine: keep, feature-flag, or redesign

### 3. Communications
- [ ] Slack integration (MCP server) — send/read messages, standup parser
- [ ] Discord integration (MCP server) — send/read messages
- [ ] Email integration (nodemailer) — notifications, summaries
- [ ] Communication hub view — unified inbox or feed
- [ ] Determine: keep, feature-flag, or redesign

### 4. Productivity & Metrics
- [ ] Productivity dashboard with meaningful metrics
- [ ] Task completion rates, streaks, velocity
- [ ] Time tracking or estimation accuracy
- [ ] Cost tracking per task/project (API usage)
- [ ] Determine: keep, feature-flag, or redesign

### 5. Fitness & Health (Withings)
- [ ] Research Withings API endpoints and OAuth flow
- [ ] Withings OAuth provider setup
- [ ] Body composition data sync (weight, body fat, muscle mass)
- [ ] Workout logging (manual + parsed from natural language)
- [ ] Fitness goals and progress tracking
- [ ] Determine: keep, feature-flag, or redesign

### 6. User Settings
- [ ] Settings page fully functional (all sections)
- [ ] Theme selection works (all color themes, dark/light)
- [ ] UI scale adjustment works
- [ ] Keyboard shortcuts configurable
- [ ] Notification preferences
- [ ] Data export / import

### 7. MCP Management
- [ ] MCP server status dashboard (connected/disconnected/error per server)
- [ ] Add/remove/configure MCP servers from UI
- [ ] MCP server health monitoring
- [ ] Tool discovery and usage stats per MCP server

### 8. Briefing / Daily Summary
- [ ] Daily briefing aggregation (tasks, calendar, notifications, etc.)
- [ ] Briefing wired into sidebar navigation
- [ ] Morning summary generation
- [ ] Configurable briefing content

### 9. Spotify Integration
- [ ] Spotify OAuth setup
- [ ] Playback controls (play, pause, next, previous)
- [ ] Now playing display
- [ ] Search and queue management
- [ ] Determine: keep, feature-flag, or redesign

---

## Feature Flag Candidates

Features that may be hidden until Sprint 2 work is complete:

| Feature | Current State | Action |
|---------|--------------|--------|
| Ideation | Stub UI | Feature-flag until fleshed out |
| Roadmap | Stub UI | Feature-flag until fleshed out |
| Communications | Stub UI | Feature-flag until MCP servers connected |
| Fitness | Stub UI | Feature-flag until Withings researched |
| Productivity | Stub UI | Feature-flag until metrics defined |
| Spotify | Not started | Feature-flag until OAuth + MCP ready |
| Briefing | Partial | Feature-flag until aggregation works |

---

## Success Criteria

> Every non-core feature either: (a) works end-to-end with proper edit/view/manage states, or (b) is cleanly feature-flagged with a clear path to completion. No half-built features visible to users.

---

## Research Required

- [ ] Withings API: endpoints, OAuth flow, rate limits, data formats
- [ ] Spotify API: playback control requirements, premium vs free tier limits
- [ ] Feature flag system: simple config-based toggle or runtime system?

---

## Notes

_As I click around the app, I'll compile a list of features to feature-flag or hide. This doc will be updated with specific findings._
