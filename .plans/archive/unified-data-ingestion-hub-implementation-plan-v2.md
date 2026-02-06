# Feature Implementation Plan: Unified Data Ingestion Hub (v2)

**Overall Progress:** `0%` (0/32 tasks complete)

**Last Updated:** 2026-01-22 (Post-Exploration + Location/Era Refinement)

---

## TL;DR
Replace 4 fragmented data entry routes with a **single unified hub** at `/contribute` featuring:
- Two-tier search (Fictotum DB + Wikidata)
- Silent auto-enrichment with location/era tags
- Creator bulk-import workflow
- User-generated entity fallback with data quality flags
- **NEW:** AI-suggested multiple era tags with confidence scoring
- **NEW:** Historical location name handling with auto-merge
- **NEW:** Error flagging with Gemini AI review + admin queue

**Scope:** Figures (people) and Works (media) only. Locations/Eras are tagged, not created by users.

---

## Critical Decisions

### Core UX Flow
- ✅ **Two-Tier Search**: Show existing DB entities first, then Wikidata matches
- ✅ **Entity Types**: Only Figure (historical/fictional people) and Work (media)
- ✅ **Silent Enrichment**: Validate match once → auto-populate fields → redirect to entity page
- ✅ **Settings Confirmation**: Show AI-suggested locations/eras with checkboxes (Option B from exploration)

### Location Handling (REFINED)
- ✅ **Historical Names**: Separate location entries (Constantinople Q16869, Istanbul Q406) linked by `modern_name`
- ✅ **Auto-Merge**: If Wikidata location similarity >= 95% + Q-ID match → auto-merge to existing
- ✅ **Unmapped Locations**: Flag for admin review if Wikidata has location not in our DB
- ✅ **Display Logic**: Show historical name contextually based on work's `setting_year`

### Era Handling (NEW MODEL)
- ✅ **Multiple Tags**: Works can have multiple era tags (e.g., "Tudor Era", "16th Century", "Renaissance")
- ✅ **AI Suggestions**: Gemini suggests 3-5 era tags based on `setting_year` + context
- ✅ **Confidence Scoring**: Track source (wikidata/ai/user) and confidence per tag
- ✅ **Override Flagging**: If user removes high-confidence tag or adds anachronistic tag → flag for admin
- ✅ **Concrete Dates**: `release_year` (required), `setting_year` (optional for filtering)

### Data Quality
- ✅ **User-Generated Fallback**: Allow creation without Wikidata, mark with `wikidata_verified: false`
- ✅ **Error Flagging**: Users can flag incorrect enrichments → Gemini AI review → admin queue
- ✅ **Duplicate Prevention**: Levenshtein >= 70% triggers warning before create

### Technical
- ✅ **Custom Wizard**: No external library (simple useState step management)
- ✅ **Delete Old Routes**: Clean slate (no redirects, remove existing contribute pages)
- ✅ **Progress Persistence**: Save search query only (24hr expiry in localStorage)
- ✅ **Mobile UX**: Vertical stack layout (same wizard flow as desktop)

---

## Implementation Tasks

### Phase 1: Database Schema & Backend APIs

- [ ] 🟥 **Task 1.1: Update Location Schema for Historical Names**
  - [ ] 🟥 Add `modern_name: STRING` to Location nodes
  - [ ] 🟥 Add `time_period: STRING` to Location nodes (e.g., "330-1453 CE")
  - [ ] 🟥 Create separate entries: Constantinople (Q16869), Byzantium (Q17151), Istanbul (Q406)
  - [ ] 🟥 Link via `modern_name: "Istanbul"` for grouping
  - **Files**: `scripts/migration/add_location_historical_names.py` (new)
  - **Notes**: Enables historical accuracy while maintaining modern geo-mapping

- [ ] 🟥 **Task 1.2: Create Era Tag Relationship Schema**
  - [ ] 🟥 Change from single `era` property to `[:TAGGED_WITH]` relationships
  - [ ] 🟥 Relationship properties: `{confidence: FLOAT, source: STRING, added_by: STRING}`
  - [ ] 🟥 Sources: "wikidata" | "ai_inferred" | "user_added"
  - [ ] 🟥 Migrate existing single-era data to relationship model
  - **Files**: `scripts/migration/migrate_era_to_tags.py` (new)
  - **Notes**: Enables multiple era tags per work

- [ ] 🟥 **Task 1.3: Add Data Quality Flags to Entities**
  - [ ] 🟥 Add `wikidata_verified: BOOLEAN` to HistoricalFigure nodes
  - [ ] 🟥 Add `data_source: STRING` to HistoricalFigure nodes ("wikidata" | "user_generated")
  - [ ] 🟥 Add same properties to MediaWork nodes
  - [ ] 🟥 Add `setting_year: INT` and `setting_year_end: INT` to MediaWork nodes
  - [ ] 🟥 Migration: set existing entities to `wikidata_verified: true` where `wikidata_id` exists
  - **Files**: `scripts/migration/add_wikidata_verified_flags.py` (new)
  - **Dependencies**: None

- [ ] 🟥 **Task 1.4: Create Wikidata Enrichment Endpoint**
  - [ ] 🟥 Build `/api/wikidata/enrich` (POST) endpoint
  - [ ] 🟥 Accept: `{entityType: "figure"|"work", searchQuery: string, wikidataId?: string}`
  - [ ] 🟥 For works: also fetch P840 (location), P2408 (era), P577 (publication date)
  - [ ] 🟥 Return: `{matches: WikidataMatch[], highConfidence: boolean, enrichedData: {...}}`
  - [ ] 🟥 Enriched data includes: locations[], eras[], setting_year, creator, etc.
  - **Files**: `web-app/app/api/wikidata/enrich/route.ts` (new)
  - **Dependencies**: None

- [ ] 🟥 **Task 1.5: Create AI Era Suggestion Endpoint**
  - [ ] 🟥 Build `/api/ai/suggest-eras` (POST) endpoint
  - [ ] 🟥 Accept: `{workTitle: string, settingYear: number, wikidataEras: string[]}`
  - [ ] 🟥 Use Gemini to suggest 3-5 additional era tags based on context
  - [ ] 🟥 Return: `{suggestedTags: [{name: string, confidence: number}]}`
  - [ ] 🟥 Combine with Wikidata eras for comprehensive suggestions
  - **Files**: `web-app/app/api/ai/suggest-eras/route.ts` (new)
  - **Notes**: Use Gemini API (key in .env)

- [ ] 🟥 **Task 1.6: Create Location Matching Utility**
  - [ ] 🟥 Build fuzzy matching function: Levenshtein + Q-ID + coordinate proximity
  - [ ] 🟥 If similarity >= 95% AND Q-ID matches → auto-merge
  - [ ] 🟥 If similarity 70-94% → return as "possible duplicate" for user confirmation
  - [ ] 🟥 If no match → return "unmapped" status for admin review
  - **Files**: `web-app/lib/locationMatcher.ts` (new)
  - **Notes**: Critical for preventing duplicate locations

- [ ] 🟥 **Task 1.7: Create Era Confidence Scoring Utility**
  - [ ] 🟥 Build function to validate era tags against `setting_year`
  - [ ] 🟥 Check if setting_year falls within era's time range
  - [ ] 🟥 Flag anachronisms (e.g., "Medieval Era" for work set in 1520)
  - [ ] 🟥 Return confidence scores for each era tag
  - **Files**: `web-app/lib/eraValidator.ts` (new)
  - **Notes**: Used for flagging suspicious user overrides

- [ ] 🟥 **Task 1.8: Create FlaggedLocation Schema**
  - [ ] 🟥 Create node type for location merge requests
  - [ ] 🟥 Properties: candidate1, candidate2, similarity, q_id_match, coord_match, status
  - [ ] 🟥 Used when user tries to add location similar to existing
  - **Files**: `scripts/migration/create_flagged_location_schema.py` (new)
  - **Dependencies**: None

- [ ] 🟥 **Task 1.9: Create FlaggedEra Schema**
  - [ ] 🟥 Create node type for era override reviews
  - [ ] 🟥 Properties: work_id, suggested_tags, user_tags, override_type, confidence_delta
  - [ ] 🟥 Types: "removed_high_confidence" | "added_anachronistic" | "added_custom"
  - **Files**: `scripts/migration/create_flagged_era_schema.py` (new)
  - **Dependencies**: None

- [ ] 🟥 **Task 1.10: Enhance Universal Search API**
  - [ ] 🟥 Add Location and Era search to existing UNION query (for context, not creation)
  - [ ] 🟥 Limit each category to 3 results
  - [ ] 🟥 Add result count metadata per category
  - **Files**: `web-app/app/api/search/universal/route.ts`
  - **Notes**: Users won't create locations/eras, but can search them for reference

- [ ] 🟥 **Task 1.11: Update Figure Creation API**
  - [ ] 🟥 Modify `/api/figures/create` to accept `wikidata_verified` and `data_source` flags
  - [ ] 🟥 Set flags based on presence of `wikidataId`
  - **Files**: `web-app/app/api/figures/create/route.ts`
  - **Dependencies**: Task 1.3

- [ ] 🟥 **Task 1.12: Update Media Creation API**
  - [ ] 🟥 Modify `/api/media/create` to accept location IDs and era tag data
  - [ ] 🟥 Create `[:SET_IN]` relationships for locations
  - [ ] 🟥 Create `[:TAGGED_WITH {confidence, source}]` relationships for eras
  - [ ] 🟥 Set `wikidata_verified`, `data_source`, `setting_year` properties
  - **Files**: `web-app/app/api/media/create/route.ts`
  - **Dependencies**: Tasks 1.2, 1.3

### Phase 2: Core Unified Hub UI

- [ ] 🟥 **Task 2.1: Create Unified Contribute Page**
  - [ ] 🟥 Build `/contribute/page.tsx` with step-based wizard
  - [ ] 🟥 Steps: 'search' | 'settings' | 'confirm' | 'creating'
  - [ ] 🟥 State: searchQuery, dbResults, wikidataResults, selectedMatch, entityType, settings
  - [ ] 🟥 Progress persistence: save/restore searchQuery from localStorage (24hr expiry)
  - **Files**: `web-app/app/contribute/page.tsx` (new)
  - **Notes**: Custom wizard (no library), settings step is NEW for location/era confirmation

- [ ] 🟥 **Task 2.2: Build Two-Tier Search Results Component**
  - [ ] 🟥 Section 1: "Already in Fictotum" (dbResults with [View Page] buttons)
  - [ ] 🟥 Section 2: "Add from Wikidata" (wikidataResults with [Add] buttons)
  - [ ] 🟥 Section 3: "Not found anywhere?" (user-generated fallback)
  - [ ] 🟥 Special handling: If Wikidata result is Person with works → dual buttons
  - **Files**: `web-app/components/TwoTierSearchResults.tsx` (new)
  - **Dependencies**: Tasks 1.4, 1.10

- [ ] 🟥 **Task 2.3: Build Wikidata Match Card Component**
  - [ ] 🟥 Display: Q-ID badge, label, description, preview of enriched data
  - [ ] 🟥 Variants: 'default' | 'creator' (for dual-button creator workflow)
  - [ ] 🟥 Show preview: "✓ Birth: 1769, Death: 1821, Era: Napoleonic"
  - **Files**: `web-app/components/WikidataMatchCard.tsx` (new)
  - **Notes**: Builds trust by previewing what will be auto-populated

- [ ] 🟥 **Task 2.4: Build Settings Confirmation Component (NEW)**
  - [ ] 🟥 For MediaWork only (not figures)
  - [ ] 🟥 Show AI-suggested locations with checkboxes (from Wikidata P840)
  - [ ] 🟥 Show AI-suggested era tags with checkboxes + confidence badges
  - [ ] 🟥 Allow manual add: [+ Add Location] [+ Add Era Tag]
  - [ ] 🟥 Display unmapped locations with options: Skip | Flag for Admin | Map to Existing
  - **Files**: `web-app/components/SettingsConfirmation.tsx` (new)
  - **Dependencies**: Tasks 1.4, 1.5, 1.6

- [ ] 🟥 **Task 2.5: Build Location Picker Component**
  - [ ] 🟥 Searchable dropdown of all existing Locations in DB
  - [ ] 🟥 Show: name, modern_name (if different), location_type
  - [ ] 🟥 Filter by name, support keyboard navigation
  - [ ] 🟥 No user creation of locations (admin-only for data quality)
  - **Files**: `web-app/components/LocationPicker.tsx` (new)
  - **Notes**: Reusable for manual location addition

- [ ] 🟥 **Task 2.6: Build Era Tag Picker Component**
  - [ ] 🟥 Searchable dropdown of all existing Eras in DB
  - [ ] 🟥 Show: name, time_period (start-end years)
  - [ ] 🟥 Highlight anachronistic selections (era range doesn't include setting_year)
  - [ ] 🟥 No user creation of eras (admin-only)
  - **Files**: `web-app/components/EraTagPicker.tsx` (new)
  - **Notes**: Warns user if selection doesn't make chronological sense

- [ ] 🟥 **Task 2.7: Build Unmapped Location Handler Component**
  - [ ] 🟥 Show when Wikidata suggests location not in our DB
  - [ ] 🟥 Display: name, Q-ID, coordinates, description
  - [ ] 🟥 Options: ○ Skip | ○ Flag for Admin | ○ Map to Existing [dropdown]
  - [ ] 🟥 If "Map to Existing": trigger similarity check, show best matches
  - **Files**: `web-app/components/UnmappedLocationHandler.tsx` (new)
  - **Dependencies**: Task 1.6 (matching utility)

- [ ] 🟥 **Task 2.8: Build Duplicate Location Warning Modal**
  - [ ] 🟥 Triggered when user tries to add location with 70-94% similarity to existing
  - [ ] 🟥 Show comparison: candidate vs existing (Q-ID, coords, usage count)
  - [ ] 🟥 Options: Use Existing | Create Anyway | Flag for Admin
  - **Files**: `web-app/components/DuplicateLocationWarning.tsx` (new)
  - **Notes**: Prevents duplicate locations while allowing genuine variants

- [ ] 🟥 **Task 2.9: Build Era Override Flagging Logic**
  - [ ] 🟥 Detect when user unchecks high-confidence (>0.8) era suggestion
  - [ ] 🟥 Detect when user adds tag that's anachronistic (setting_year outside era range)
  - [ ] 🟥 Create FlaggedEra node silently (don't block user)
  - [ ] 🟥 Show subtle indicator: "⚠️ This selection will be reviewed by admins"
  - **Files**: `web-app/lib/eraFlaggingLogic.ts` (new)
  - **Dependencies**: Task 1.7, 1.9

- [ ] 🟥 **Task 2.10: Build Enrichment Preview Component**
  - [ ] 🟥 Final confirmation before creating entity
  - [ ] 🟥 Show: Name, Q-ID, auto-populated fields, selected locations, selected era tags
  - [ ] 🟥 Read-only preview (no editing)
  - [ ] 🟥 Buttons: [Cancel] [Confirm & Create]
  - **Files**: `web-app/components/EnrichmentPreview.tsx` (new)
  - **Notes**: Builds user trust by showing transparency

- [ ] 🟥 **Task 2.11: Build User-Generated Entity Form**
  - [ ] 🟥 Manual form when no Wikidata match exists
  - [ ] 🟥 Pre-fill name from search query
  - [ ] 🟥 For Figure: birth_year, death_year, description, historicity
  - [ ] 🟥 For Work: year, media_type, creator, description (no auto-location/era)
  - [ ] 🟥 Show warning: "⚠️ Marked as user-generated (unverified)"
  - **Files**: `web-app/components/UserGeneratedEntityForm.tsx` (new)
  - **Notes**: Fallback when Wikidata unavailable

- [ ] 🟥 **Task 2.12: Build Entity Orchestrator**
  - [ ] 🟥 Coordinate all API calls for entity creation
  - [ ] 🟥 Fetch enrichment from `/api/wikidata/enrich`
  - [ ] 🟥 Fetch AI era suggestions from `/api/ai/suggest-eras`
  - [ ] 🟥 Match locations via `locationMatcher.ts`
  - [ ] 🟥 Validate era tags via `eraValidator.ts`
  - [ ] 🟥 Call `/api/figures/create` or `/api/media/create` with full payload
  - [ ] 🟥 Handle errors: Wikidata timeout → fallback to user-generated
  - **Files**: `web-app/lib/entityOrchestrator.ts` (new)
  - **Dependencies**: Tasks 1.4, 1.5, 1.6, 1.7, 1.11, 1.12

### Phase 3: Creator Workflow

- [ ] 🟥 **Task 3.1: Build Creator Works View Component**
  - [ ] 🟥 Display list of works fetched from `/api/wikidata/by-creator`
  - [ ] 🟥 Show status badges: ✓ In DB | ➕ Add
  - [ ] 🟥 Checkbox: "☑ Also add [Creator] as a Figure"
  - [ ] 🟥 Bulk button: [Add All (N works)] with progress bar
  - **Files**: `web-app/components/CreatorWorksView.tsx` (new)
  - **Dependencies**: Task 2.12

- [ ] 🟥 **Task 3.2: Integrate Creator Detection Logic**
  - [ ] 🟥 In TwoTierSearchResults, detect if Wikidata match is a Person (instance of Q5)
  - [ ] 🟥 Query Wikidata for notable works property
  - [ ] 🟥 If has works: render WikidataMatchCard with variant='creator'
  - **Files**: `web-app/components/TwoTierSearchResults.tsx`
  - **Dependencies**: Task 2.2, 2.3

- [ ] 🟥 **Task 3.3: Implement Bulk Add with Auto-Create Creator**
  - [ ] 🟥 When [Add All] clicked:
  - [ ] 🟥 Step 1: Create creator as HistoricalFigure (if checkbox checked)
  - [ ] 🟥 Step 2: Loop works, create MediaWork with creator property
  - [ ] 🟥 Step 3: For each work, fetch settings (locations/eras) from Wikidata
  - [ ] 🟥 Show progress: "Adding 3 of 15..." with animated bar
  - [ ] 🟥 Handle partial failures: show summary "12 succeeded, 3 failed"
  - **Files**: `web-app/lib/entityOrchestrator.ts`
  - **Dependencies**: Task 3.1, 2.12

### Phase 4: Navigation & Cleanup

- [ ] 🟥 **Task 4.1: Update Navbar**
  - [ ] 🟥 Replace "Contribute" dropdown with single link to `/contribute`
  - [ ] 🟥 Remove: "Add Media Work", "Add Figure", "Add Appearance", "Add by Creator"
  - [ ] 🟥 Update desktop (lines 91-124) and mobile (lines 252-288) menus
  - **Files**: `web-app/components/Navbar.tsx`
  - **Dependencies**: Task 2.1

- [ ] 🟥 **Task 4.2: Delete Old Contribute Pages**
  - [ ] 🟥 Delete `/contribute/figure/page.tsx`
  - [ ] 🟥 Delete `/contribute/media/page.tsx`
  - [ ] 🟥 Delete `/contribute/appearance/page.tsx`
  - [ ] 🟥 Delete `/contribute/creator/` directory
  - **Files**: `web-app/app/contribute/{figure,media,appearance,creator}/**`
  - **Notes**: Clean slate - no redirects

- [ ] 🟥 **Task 4.3: Add User Role System**
  - [ ] 🟥 Add `role: STRING` property to User nodes
  - [ ] 🟥 Migration: set all existing users to `role: "user"`
  - [ ] 🟥 Manually set your user to `role: "admin"` via Cypher
  - [ ] 🟥 Update `auth()` to include role in session object
  - **Files**: `scripts/migration/add_user_roles.py`, `web-app/lib/auth.ts`
  - **Notes**: Required for admin queue access control

### Phase 5: Error Flagging & AI Review

- [ ] 🟥 **Task 5.1: Create FlaggedEntity Database Schema**
  - [ ] 🟥 Create node type for general error flags
  - [ ] 🟥 Properties: flag_id, entity_id, entity_type, field_name, current_value, user_feedback, status, ai_suggestion, ai_confidence
  - [ ] 🟥 Create index on status for efficient queue queries
  - **Files**: `scripts/migration/create_flagged_entity_schema.py`
  - **Dependencies**: None

- [ ] 🟥 **Task 5.2: Build Error Flag Button Component**
  - [ ] 🟥 Small button next to auto-enriched fields on entity pages
  - [ ] 🟥 On click: modal with textarea for user explanation
  - [ ] 🟥 On submit: POST to `/api/entities/flag-error`
  - **Files**: `web-app/components/ErrorFlagButton.tsx` (new)
  - **Notes**: Add to figure/media detail pages in future PR

- [ ] 🟥 **Task 5.3: Create Flag Error API Endpoint**
  - [ ] 🟥 Build `/api/entities/flag-error` (POST)
  - [ ] 🟥 Accept: entityId, entityType, fieldName, currentValue, userFeedback
  - [ ] 🟥 Create FlaggedEntity node with status: "pending_ai_review"
  - [ ] 🟥 Trigger async Gemini review (webhook/queue, don't block response)
  - **Files**: `web-app/app/api/entities/flag-error/route.ts` (new)
  - **Dependencies**: Task 5.1

- [ ] 🟥 **Task 5.4: Implement Gemini AI Review Worker**
  - [ ] 🟥 Background job processing flags with status: "pending_ai_review"
  - [ ] 🟥 Prompt: "User reports [field] for [entity] (Q-ID) is incorrect. Verify against Wikidata and authoritative sources."
  - [ ] 🟥 Parse response: {confidence: 0-1, suggested_value: any, reasoning: string}
  - [ ] 🟥 If confidence >= 0.9: set status="ai_rejected", notify user
  - [ ] 🟥 If confidence < 0.9: set status="pending_admin_review"
  - **Files**: `web-app/lib/workers/aiReviewWorker.ts` (new)
  - **Notes**: Use Gemini API key from .env

- [ ] 🟥 **Task 5.5: Build Admin Review Queue Page**
  - [ ] 🟥 Create `/admin/review-queue/page.tsx` (requires role="admin")
  - [ ] 🟥 Tabs: "Entity Errors" | "Location Merges" | "Era Overrides"
  - [ ] 🟥 Table columns: entity, field, current, user says, AI suggests, actions
  - [ ] 🟥 Actions: [Approve AI] [Manual Fix] [Reject Flag]
  - **Files**: `web-app/app/admin/review-queue/page.tsx` (new)
  - **Dependencies**: Tasks 5.1, 5.4, 4.3

- [ ] 🟥 **Task 5.6: Build Location Merge Review Tab**
  - [ ] 🟥 Add "Location Merges" tab to admin queue
  - [ ] 🟥 Show: candidate1 vs candidate2, similarity %, Q-ID match, coord match
  - [ ] 🟥 Display usage counts: "Used in N works"
  - [ ] 🟥 Actions: [Merge into Canonical] [Keep Separate] [Delete Duplicate]
  - [ ] 🟥 Merge action: migrate all relationships, create audit log, delete duplicate
  - **Files**: `web-app/app/admin/review-queue/page.tsx`
  - **Dependencies**: Task 1.8, 5.5

- [ ] 🟥 **Task 5.7: Build Era Override Review Tab**
  - [ ] 🟥 Add "Era Overrides" tab to admin queue
  - [ ] 🟥 Show: work, setting_year, AI suggested tags, user selected tags
  - [ ] 🟥 Highlight: removed high-confidence tags, added anachronistic tags
  - [ ] 🟥 Actions: [Approve User Selection] [Revert to AI Suggestion] [Custom Fix]
  - **Files**: `web-app/app/admin/review-queue/page.tsx`
  - **Dependencies**: Task 1.9, 5.5

- [ ] 🟥 **Task 5.8: Create Admin API Endpoints**
  - [ ] 🟥 `/api/admin/review-queue` (GET): list all pending flags
  - [ ] 🟥 `/api/admin/resolve-flag` (POST): resolve entity error flag
  - [ ] 🟥 `/api/admin/merge-locations` (POST): merge duplicate locations
  - [ ] 🟥 `/api/admin/resolve-era-override` (POST): approve/reject era changes
  - [ ] 🟥 Auth check: `session.user.role === "admin"` for all endpoints
  - **Files**: `web-app/app/api/admin/` (multiple new route files)
  - **Dependencies**: Task 4.3

### Phase 6: Edge Cases & Polish

- [ ] 🟥 **Task 6.1: Implement Duplicate Entity Detection**
  - [ ] 🟥 Before creating figure/work, run Levenshtein search (>= 70% threshold)
  - [ ] 🟥 Show warning modal with existing entity link
  - [ ] 🟥 Require checkbox: "I confirm this is a different person/work"
  - **Files**: `web-app/lib/entityOrchestrator.ts`, `web-app/components/DuplicateEntityWarning.tsx` (new)
  - **Notes**: Prevents accidental duplicates (e.g., "Julius Caesar" vs "Gaius Julius Caesar")

- [ ] 🟥 **Task 6.2: Add Session Timeout Handling**
  - [ ] 🟥 Wrap all API calls in auth error handler
  - [ ] 🟥 On 401: save wizard state to localStorage, redirect to sign-in
  - [ ] 🟥 After sign-in: restore state with prompt "Continue where you left off?"
  - **Files**: `web-app/lib/apiClient.ts` (new), `web-app/app/contribute/page.tsx`
  - **Notes**: Prevents lost work during long sessions

- [ ] 🟥 **Task 6.3: Implement Loading States & Progress**
  - [ ] 🟥 Spinner during Wikidata enrichment (5s timeout)
  - [ ] 🟥 Skeleton loaders for search results
  - [ ] 🟥 Progress bar for creator bulk import
  - [ ] 🟥 Step indicator: "Step 1 of 3" (optional)
  - **Files**: All wizard components
  - **Notes**: UX polish for async operations

- [ ] 🟥 **Task 6.4: Mobile Responsive Design**
  - [ ] 🟥 Vertical stack for search results (full-width cards)
  - [ ] 🟥 Full-width buttons (min 44px height for touch)
  - [ ] 🟥 Collapsible settings section on small screens
  - [ ] 🟥 Test viewports: 320px, 375px, 768px, 1024px
  - **Files**: All components + Tailwind CSS
  - **Notes**: Same flow as desktop, just vertical stacking

- [ ] 🟥 **Task 6.5: Add Contextual Location Display Logic**
  - [ ] 🟥 Build helper: `displayLocationName(location, settingYear)`
  - [ ] 🟥 If settingYear falls within location.time_period → show historical name
  - [ ] 🟥 Otherwise show modern_name for contemporary works
  - [ ] 🟥 Example: Work set in 500 CE → show "Constantinople", not "Istanbul"
  - **Files**: `web-app/lib/locationDisplay.ts` (new)
  - **Notes**: Makes historical names contextually accurate

### Phase 7: Testing & Documentation

- [ ] 🟥 **Task 7.1: Manual Testing - Happy Paths**
  - [ ] 🟥 Test: Create figure from Wikidata (e.g., "Marie Curie")
  - [ ] 🟥 Test: Create work from Wikidata with locations/eras (e.g., "Gladiator")
  - [ ] 🟥 Test: Creator bulk import (e.g., "Ridley Scott" → 10 films)
  - [ ] 🟥 Test: User-generated entity (no Wikidata match)
  - [ ] 🟥 Verify: Enriched data accuracy, locations linked, era tags applied

- [ ] 🟥 **Task 7.2: Manual Testing - Location/Era Edge Cases**
  - [ ] 🟥 Test: Unmapped location from Wikidata → flag for admin
  - [ ] 🟥 Test: Duplicate location detection (95% similarity → auto-merge)
  - [ ] 🟥 Test: User unchecks high-confidence era → verify flagged
  - [ ] 🟥 Test: User adds anachronistic era → verify flagged
  - [ ] 🟥 Test: Historical name display (Constantinople for work set in 500 CE)

- [ ] 🟥 **Task 7.3: Manual Testing - Error Cases**
  - [ ] 🟥 Test: Wikidata timeout (network throttle)
  - [ ] 🟥 Test: Multiple Wikidata matches (e.g., "Alexander")
  - [ ] 🟥 Test: Session timeout mid-wizard
  - [ ] 🟥 Test: Bulk import partial failure (3 of 10 works fail)
  - [ ] 🟥 Test: Error flagging → AI review → admin queue

- [ ] 🟥 **Task 7.4: Update Documentation**
  - [ ] 🟥 Update README with new contribution workflow
  - [ ] 🟥 Document location/era tagging system
  - [ ] 🟥 Document admin review queue for admins
  - [ ] 🟥 Add inline help tooltips to wizard
  - **Files**: `README.md`, inline components

- [ ] 🟥 **Task 7.5: Code Review & Cleanup**
  - [ ] 🟥 Remove unused imports
  - [ ] 🟥 Ensure consistent error handling patterns
  - [ ] 🟥 Verify TypeScript types
  - [ ] 🟥 Run ESLint, fix warnings
  - [ ] 🟥 Test accessibility (keyboard nav, ARIA labels)

---

## Rollback Plan

**If things go wrong:**

1. **Revert Navbar**
   ```bash
   git checkout HEAD~1 -- web-app/components/Navbar.tsx
   ```

2. **Restore Old Contribute Pages**
   ```bash
   git revert <deletion-commit-hash>
   ```

3. **Database Cleanup**
   ```cypher
   // Remove entities created via unified hub
   MATCH (n)
   WHERE n.ingestion_source = "unified_hub"
     AND n.created_at > datetime('2026-01-22T00:00:00Z')
   DETACH DELETE n

   // Remove FlaggedEntity/Location/Era nodes
   MATCH (f)
   WHERE f:FlaggedEntity OR f:FlaggedLocation OR f:FlaggedEra
   DETACH DELETE f

   // Revert schema changes
   MATCH (n)
   WHERE n:HistoricalFigure OR n:MediaWork OR n:Location
   REMOVE n.wikidata_verified, n.data_source, n.setting_year, n.setting_year_end, n.modern_name, n.time_period
   ```

---

## Success Criteria

✅ Users can create Figures and Works through single `/contribute` entry point
✅ Two-tier search prevents duplicates by surfacing existing entities first
✅ Wikidata auto-enrichment populates 70%+ of metadata
✅ Location/era suggestions appear with AI confidence scores
✅ Duplicate locations auto-merge at 95%+ similarity
✅ Historical location names display contextually (Constantinople for ancient works)
✅ Multiple era tags enable rich discovery (work tagged with 3-5 relevant eras)
✅ Creator bulk import adds 10+ works with progress indicator
✅ User-generated entities clearly marked as unverified
✅ Error flagging achieves 90%+ AI auto-resolution rate
✅ Admin queue functional for all review types (errors, locations, eras)
✅ Mobile UI responsive (320px-1024px viewports)
✅ No increase in duplicate entities post-deployment
✅ User time-to-contribute decreases 30%

---

## Out of Scope

- ❌ User creation of Locations (admin-only for data quality)
- ❌ User creation of Eras (admin-only for consistency)
- ❌ Appearance creation in hub (stays on figure pages)
- ❌ Bulk CSV import
- ❌ Collaborative editing with conflict resolution
- ❌ Wikidata write-back (read-only)
- ❌ Version history/audit trail
- ❌ Public API for entity creation
- ❌ Advanced search filters (by era, year range, etc.)
- ❌ Relationship editing/deletion

---

## Key UX Principles

- **Two-Tier Search**: DB first → Wikidata second → User-generated fallback
- **Settings Confirmation**: Show AI suggestions, let user adjust (Option B)
- **Silent Enrichment**: Validate match once, auto-populate everything else
- **Historical Accuracy**: Separate location entries + contextual name display
- **Multiple Era Tags**: AI suggests 3-5 tags, user can add/remove
- **Graceful Degradation**: Wikidata fails → user-generated form
- **Progressive Disclosure**: Simple for basic, advanced options revealed contextually

---

## Technical Constraints

- Must preserve MediaWork Ingestion Protocol (Q-ID canonical)
- Must not break existing API contracts
- Must handle Wikidata rate limits (5s timeout)
- Must support offline creation (user-generated fallback)
- Must auto-merge locations at 95%+ similarity without user intervention
- Must flag era overrides without blocking creation

---

## Database Schema Reference

### Location (Updated)
```cypher
{
  location_id: STRING,
  name: STRING,              // Historical or modern name
  modern_name: STRING,       // NEW: For grouping/mapping (e.g., "Istanbul")
  time_period: STRING,       // NEW: "330-1453 CE" (when this name was used)
  wikidata_id: STRING,       // Separate Q-IDs for historical variants
  coordinates: {...},
  location_type: STRING
}
```

### MediaWork (Updated)
```cypher
{
  media_id: STRING,
  title: STRING,
  release_year: INT,         // When created/published
  setting_year: INT,         // NEW: When story takes place (optional)
  setting_year_end: INT,     // NEW: For time-spanning stories (optional)
  wikidata_id: STRING,
  wikidata_verified: BOOLEAN,  // NEW
  data_source: STRING,         // NEW: "wikidata" | "user_generated"
  // Removed: single `era` property
}

// Relationships for locations
(work)-[:SET_IN {prominence: STRING}]->(location)

// Relationships for era tags (NEW MODEL)
(work)-[:TAGGED_WITH {
  confidence: FLOAT,      // 0.0-1.0
  source: STRING,         // "wikidata" | "ai_inferred" | "user_added"
  added_by: STRING,       // User email (if user_added)
  added_at: DATETIME
}]->(era)
```

### FlaggedLocation (New)
```cypher
{
  flag_id: STRING,
  candidate1_id: STRING,
  candidate2_id: STRING,
  similarity: FLOAT,
  q_id_match: BOOLEAN,
  coord_match: BOOLEAN,
  status: STRING,  // "pending_review" | "merged" | "kept_separate"
  flagged_at: DATETIME,
  resolved_by: STRING,
  resolved_at: DATETIME
}
```

### FlaggedEra (New)
```cypher
{
  flag_id: STRING,
  work_id: STRING,
  suggested_tags: [STRING],      // AI/Wikidata suggestions
  user_selected_tags: [STRING],  // What user chose
  override_type: STRING,         // "removed_high_confidence" | "added_anachronistic" | "added_custom"
  confidence_delta: FLOAT,       // How much confidence dropped
  status: STRING,
  flagged_at: DATETIME,
  resolved_by: STRING,
  resolved_at: DATETIME
}
```

---

## API Endpoints Reference

### New Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/wikidata/enrich` | Get entity + locations/eras from Wikidata | Public |
| POST | `/api/ai/suggest-eras` | Gemini suggests era tags based on context | Public |
| POST | `/api/entities/flag-error` | User reports incorrect enriched data | User |
| GET | `/api/admin/review-queue` | List all pending flags (errors, locations, eras) | Admin |
| POST | `/api/admin/resolve-flag` | Resolve entity error flag | Admin |
| POST | `/api/admin/merge-locations` | Merge duplicate locations | Admin |
| POST | `/api/admin/resolve-era-override` | Approve/reject era tag changes | Admin |

### Modified Endpoints

| Endpoint | Changes |
|----------|---------|
| `/api/search/universal` | Add Location + Era search |
| `/api/figures/create` | Accept `wikidata_verified`, `data_source` |
| `/api/media/create` | Accept location IDs, era tags, `setting_year`, `wikidata_verified` |

---

## File Manifest

### New Files (32 total)

**Components (14):**
- `web-app/app/contribute/page.tsx` - Unified hub wizard
- `web-app/components/TwoTierSearchResults.tsx`
- `web-app/components/WikidataMatchCard.tsx`
- `web-app/components/SettingsConfirmation.tsx` ⭐ NEW
- `web-app/components/LocationPicker.tsx` ⭐ NEW
- `web-app/components/EraTagPicker.tsx` ⭐ NEW
- `web-app/components/UnmappedLocationHandler.tsx` ⭐ NEW
- `web-app/components/DuplicateLocationWarning.tsx` ⭐ NEW
- `web-app/components/EnrichmentPreview.tsx`
- `web-app/components/UserGeneratedEntityForm.tsx`
- `web-app/components/CreatorWorksView.tsx`
- `web-app/components/ErrorFlagButton.tsx`
- `web-app/components/DuplicateEntityWarning.tsx`

**Libraries (7):**
- `web-app/lib/entityOrchestrator.ts`
- `web-app/lib/locationMatcher.ts` ⭐ NEW
- `web-app/lib/eraValidator.ts` ⭐ NEW
- `web-app/lib/eraFlaggingLogic.ts` ⭐ NEW
- `web-app/lib/locationDisplay.ts` ⭐ NEW
- `web-app/lib/apiClient.ts`
- `web-app/lib/workers/aiReviewWorker.ts`

**API Routes (7):**
- `web-app/app/api/wikidata/enrich/route.ts`
- `web-app/app/api/ai/suggest-eras/route.ts` ⭐ NEW
- `web-app/app/api/entities/flag-error/route.ts`
- `web-app/app/api/admin/review-queue/route.ts`
- `web-app/app/api/admin/resolve-flag/route.ts`
- `web-app/app/api/admin/merge-locations/route.ts` ⭐ NEW
- `web-app/app/api/admin/resolve-era-override/route.ts` ⭐ NEW

**Admin UI (1):**
- `web-app/app/admin/review-queue/page.tsx`

**Migrations (9):**
- `scripts/migration/add_location_historical_names.py` ⭐ NEW
- `scripts/migration/migrate_era_to_tags.py` ⭐ NEW
- `scripts/migration/add_wikidata_verified_flags.py`
- `scripts/migration/create_flagged_entity_schema.py`
- `scripts/migration/create_flagged_location_schema.py` ⭐ NEW
- `scripts/migration/create_flagged_era_schema.py` ⭐ NEW
- `scripts/migration/add_user_roles.py`

### Modified Files (4)
- `web-app/components/Navbar.tsx`
- `web-app/app/api/search/universal/route.ts`
- `web-app/app/api/figures/create/route.ts`
- `web-app/app/api/media/create/route.ts`
- `web-app/lib/auth.ts`

### Deleted Files (5)
- `web-app/app/contribute/figure/page.tsx`
- `web-app/app/contribute/media/page.tsx`
- `web-app/app/contribute/appearance/page.tsx`
- `web-app/app/contribute/creator/page.tsx`
- `web-app/app/contribute/creator/CreatorContent.tsx`

---

**Plan Status:** ✅ Ready for implementation with all refinements
**Next Step:** Hand off to specialist agents for parallel execution
