# Feature Implementation Plan: Unified Data Ingestion Hub

**Overall Progress:** `0%` (0/24 tasks complete)

---

## TL;DR
Replace the current fragmented data entry system (4 separate navbar entries: Add Media Work, Add Figure, Add Appearance, Add by Creator) with a single unified hub that starts with search, intelligently surfaces existing entities, and guides users through minimal-friction data addition with automatic enrichment from Wikidata.

---

## Critical Decisions

Key architectural/implementation choices:

- **Single Entry Point**: New `/contribute` page replaces all existing contribute routes, accessible via simplified navbar
- **Search-First UX**: Users always start by searching - this prevents duplicates and surfaces existing entities before allowing new creation
- **Type Selection After Search Fail**: Only when search yields no results do we ask users to select entity type (Figure, Media Work, Location, Era, Creator)
- **Minimal User Input**: Ask only for essential identifier (name/title), then auto-fetch enrichment data from Wikidata behind the scenes
- **Intelligent Matching**: For ambiguous searches (e.g., multiple "Napoleon" entries in Wikidata), present options with distinguishing metadata (birth year, description) for user selection
- **Automatic Enrichment**: Once user confirms a match (or we create a new entity), automatically populate birth/death years, release years, settings, Q-IDs, etc. without user intervention
- **Preserve Existing APIs**: Backend APIs (`/api/figures/create`, `/api/media/create`, etc.) remain unchanged; only frontend orchestration changes
- **Wikidata-First Protocol**: Follow existing MediaWork Ingestion Protocol for all entity types where applicable

---

## Implementation Tasks

### Phase 1: Backend - Universal Search Enhancement

- [ ] 🟥 **Task 1.1: Enhance Universal Search API**
  - [ ] 🟥 Add support for searching Locations and Eras
  - [ ] 🟥 Improve result ranking to surface most relevant matches first
  - [ ] 🟥 Add result count metadata for each category
  - **Files**: `web-app/app/api/search/universal/route.ts`
  - **Notes**: Extend existing Cypher query to include Location and Era nodes; add confidence scoring

- [ ] 🟥 **Task 1.2: Create Wikidata Auto-Enrichment Endpoint**
  - [ ] 🟥 Build new API endpoint `/api/wikidata/enrich` that accepts entity type + name
  - [ ] 🟥 Returns top 3-5 Wikidata matches with distinguishing metadata
  - [ ] 🟥 For each match, include: Q-ID, label, description, birth/death years (figures), release year (media), etc.
  - **Files**: `web-app/app/api/wikidata/enrich/route.ts` (new)
  - **Notes**: Reuse existing `searchWikidataForWork` and `validateQid` utilities from `web-app/lib/wikidata.ts`

- [ ] 🟥 **Task 1.3: Create Entity Suggestion API**
  - [ ] 🟥 Build endpoint `/api/suggest/entity` for intelligent entity type detection
  - [ ] 🟥 Given a search term, return suggested entity type (Figure vs Media Work vs Location)
  - [ ] 🟥 Use heuristics: person names vs work titles vs place names
  - **Files**: `web-app/app/api/suggest/entity/route.ts` (new)
  - **Notes**: Optional enhancement - can start with manual type selection

### Phase 2: Frontend - Unified Contribute Hub

- [ ] 🟥 **Task 2.1: Create Unified Contribute Page Component**
  - [ ] 🟥 Build `/contribute/page.tsx` with multi-step wizard UI
  - [ ] 🟥 Step 1: Universal search input
  - [ ] 🟥 Step 2: Show existing results OR offer "Add New" option
  - [ ] 🟥 Step 3: Entity type selection (if adding new)
  - [ ] 🟥 Step 4: Wikidata matching interface (show multiple matches, let user pick)
  - [ ] 🟥 Step 5: Confirmation + auto-enrichment summary
  - **Files**: `web-app/app/contribute/page.tsx` (new)
  - **Notes**: Use shadcn/ui components for wizard steps; maintain existing dark theme styling

- [ ] 🟥 **Task 2.2: Build Search Results Component**
  - [ ] 🟥 Display categorized search results (Figures, Media Works, Locations, Eras, Series, Creators, Actors)
  - [ ] 🟥 Each result shows preview card with key metadata
  - [ ] 🟥 "View Details" links to existing entity pages
  - [ ] 🟥 Clear "Not found? Add new entity" CTA
  - **Files**: `web-app/components/SearchResults.tsx` (new)
  - **Dependencies**: Task 1.1 must complete first

- [ ] 🟥 **Task 2.3: Build Entity Type Selector Component**
  - [ ] 🟥 Radio button group or card-based selector
  - [ ] 🟥 Options: Historical Figure, Media Work, Location, Era
  - [ ] 🟥 Each option shows icon + brief description
  - **Files**: `web-app/components/EntityTypeSelector.tsx` (new)
  - **Notes**: Exclude "Creator" and "Actor" as separate types (they're derived from relationships)

- [ ] 🟥 **Task 2.4: Build Wikidata Matcher Component**
  - [ ] 🟥 Shows top Wikidata matches as selectable cards
  - [ ] 🟥 Each card displays: Q-ID, label, description, key dates/metadata
  - [ ] 🟥 "None of these match" option triggers manual form
  - [ ] 🟥 Selected match highlights and shows preview of enriched data
  - **Files**: `web-app/components/WikidataMatcher.tsx` (new)
  - **Dependencies**: Task 1.2 must complete first

- [ ] 🟥 **Task 2.5: Build Entity Creation Orchestrator**
  - [ ] 🟥 Coordinate API calls to create entity + enrichment data
  - [ ] 🟥 For Figures: call `/api/figures/create` with Wikidata-enriched payload
  - [ ] 🟥 For Media: call `/api/media/create` with Q-ID and auto-fetched metadata
  - [ ] 🟥 For Locations/Eras: call appropriate creation endpoints
  - [ ] 🟥 Handle errors gracefully with rollback messages
  - **Files**: `web-app/lib/entityOrchestrator.ts` (new)
  - **Dependencies**: Tasks 1.2, 2.4 must complete first

- [ ] 🟥 **Task 2.6: Create Enrichment Summary Component**
  - [ ] 🟥 Shows user what data was auto-populated (birth year, Q-ID, settings, etc.)
  - [ ] 🟥 Displays before final submission for confirmation
  - [ ] 🟥 Allows user to edit auto-filled values if incorrect
  - **Files**: `web-app/components/EnrichmentSummary.tsx` (new)
  - **Notes**: Build trust by showing users exactly what we're doing

### Phase 3: Navigation & Deprecation

- [ ] 🟥 **Task 3.1: Update Navbar Component**
  - [ ] 🟥 Replace "Contribute" dropdown with single "Contribute" link to `/contribute`
  - [ ] 🟥 Remove individual links: "Add Media Work", "Add Figure", "Add Appearance", "Add by Creator"
  - [ ] 🟥 Update mobile menu to match desktop changes
  - **Files**: `web-app/components/Navbar.tsx`
  - **Dependencies**: Task 2.1 must complete first

- [ ] 🟥 **Task 3.2: Add Redirects for Legacy Routes**
  - [ ] 🟥 Redirect `/contribute/media` → `/contribute`
  - [ ] 🟥 Redirect `/contribute/figure` → `/contribute`
  - [ ] 🟥 Redirect `/contribute/appearance` → `/contribute`
  - [ ] 🟥 Redirect `/contribute/creator` → `/contribute`
  - **Files**: `web-app/middleware.ts` or Next.js config
  - **Notes**: Preserve bookmarks and external links; add query param to pre-select type if needed

- [ ] 🟥 **Task 3.3: Deprecate Old Contribute Pages**
  - [ ] 🟥 Mark old pages as deprecated with banner linking to new unified hub
  - [ ] 🟥 Keep old pages functional for 1-2 weeks before removal
  - [ ] 🟥 Update any internal links pointing to old routes
  - **Files**: `web-app/app/contribute/media/page.tsx`, `web-app/app/contribute/figure/page.tsx`, `web-app/app/contribute/appearance/page.tsx`, `web-app/app/contribute/creator/page.tsx`
  - **Notes**: Graceful transition period to avoid breaking user workflows

### Phase 4: Edge Cases & Polish

- [ ] 🟥 **Task 4.1: Handle "Appearance" Workflow in Unified Hub**
  - [ ] 🟥 When user wants to add an appearance (figure in a media work), detect this intent
  - [ ] 🟥 Guide user to select figure first, then media work
  - [ ] 🟥 Auto-create both if they don't exist, then create appearance relationship
  - [ ] 🟥 Reuse `AddAppearanceForm` logic but integrate into unified wizard
  - **Files**: `web-app/components/AppearanceWorkflow.tsx` (new), `web-app/app/contribute/page.tsx`
  - **Notes**: Most complex workflow - may need separate wizard branch

- [ ] 🟥 **Task 4.2: Handle "Creator Browse" Workflow**
  - [ ] 🟥 When user searches for a creator name, surface all works by that creator
  - [ ] 🟥 Offer "Add another work by [Creator]" shortcut
  - [ ] 🟥 Pre-fill creator field in media creation form
  - **Files**: `web-app/components/CreatorWorkflow.tsx` (new)
  - **Notes**: Replace existing `/contribute/creator` functionality

- [ ] 🟥 **Task 4.3: Add Loading States & Progress Indicators**
  - [ ] 🟥 Show spinner during Wikidata lookups
  - [ ] 🟥 Display progress bar for multi-step wizard
  - [ ] 🟥 Skeleton loaders for search results
  - **Files**: All new component files
  - **Notes**: UX polish to manage user expectations during async operations

- [ ] 🟥 **Task 4.4: Implement Duplicate Prevention**
  - [ ] 🟥 Before final entity creation, run one more duplicate check
  - [ ] 🟥 Show warning modal if very similar entity exists
  - [ ] 🟥 Require explicit confirmation to proceed with duplicate
  - **Files**: `web-app/lib/entityOrchestrator.ts`, `web-app/components/DuplicateWarning.tsx` (new)
  - **Notes**: Critical for data quality - reuse logic from existing `/contribute/figure` page

### Phase 5: Testing & Documentation

- [ ] 🟥 **Task 5.1: Manual Testing - Happy Paths**
  - [ ] 🟥 Test adding a new figure with Wikidata match (e.g., "Marie Curie")
  - [ ] 🟥 Test adding a new media work with Wikidata match (e.g., "Oppenheimer")
  - [ ] 🟥 Test adding appearance relationship
  - [ ] 🟥 Test creator browse workflow
  - [ ] 🟥 Verify all auto-enriched data is correct

- [ ] 🟥 **Task 5.2: Manual Testing - Edge Cases**
  - [ ] 🟥 Test entity with no Wikidata match (manual fallback)
  - [ ] 🟥 Test ambiguous Wikidata matches (multiple "Napoleon" results)
  - [ ] 🟥 Test search returning existing entity (should not allow duplicate)
  - [ ] 🟥 Test error handling (network failures, API errors)
  - [ ] 🟥 Test mobile responsiveness

- [ ] 🟥 **Task 5.3: Update User Documentation**
  - [ ] 🟥 Update README or user guide with new contribution workflow
  - [ ] 🟥 Add tooltips and help text to new UI components
  - [ ] 🟥 Create GIF/video walkthrough for first-time contributors
  - **Files**: `README.md`, inline help components

- [ ] 🟥 **Task 5.4: Code Review & Cleanup**
  - [ ] 🟥 Remove unused imports and commented code
  - [ ] 🟥 Ensure consistent error handling patterns
  - [ ] 🟥 Verify all TypeScript types are properly defined
  - [ ] 🟥 Run linter and fix any warnings

---

## Rollback Plan

**If things go wrong:**

1. **Revert Navbar Changes**
   - Restore old "Contribute" dropdown with 4 separate links
   - Remove link to `/contribute` unified hub

2. **Remove Redirects**
   - Delete middleware redirects for legacy routes
   - Ensure old routes are directly accessible again

3. **Restore Old Contribute Pages**
   - Remove deprecation banners from old pages
   - Ensure they function as before

4. **Database Cleanup (if needed)**
   - If any malformed entities were created during testing, manually delete via Neo4j query:
     ```cypher
     MATCH (n)
     WHERE n.ingestion_batch STARTS WITH 'unified_hub_'
     DELETE n
     ```

5. **Communication**
   - Notify users via banner or email that old workflow is restored
   - Apologize for any confusion during transition

---

## Success Criteria

✅ Users can add any entity type (Figure, Media Work, Location, Era) through single `/contribute` entry point
✅ Search successfully prevents duplicate entity creation by surfacing existing matches
✅ Wikidata auto-enrichment populates at least 70% of entity metadata without user input
✅ Legacy contribute routes redirect to new hub without breaking user workflows
✅ Appearance creation workflow is streamlined and integrated into unified hub
✅ Mobile UI is fully responsive and usable on small screens
✅ No increase in duplicate entities in database after deployment
✅ User time-to-contribute decreases by at least 30% (measured via analytics)

---

## Out of Scope (For This Plan)

- **Bulk Import Workflow**: Uploading CSV/JSON files to create multiple entities at once (future enhancement)
- **AI-Powered Entity Extraction**: Automatically detecting entities from unstructured text (future enhancement)
- **Collaborative Editing**: Multiple users editing same entity simultaneously with conflict resolution
- **Advanced Wikidata Integration**: Syncing ChronosGraph data back to Wikidata (read-only for now)
- **Location/Era Creation UI**: For MVP, assume Locations and Eras are seeded by admins (can add later)
- **Relationship Editing**: Editing/deleting existing relationships (separate feature)
- **Version History**: Tracking changes to entities over time (future enhancement)
- **Permission System**: Role-based access control for contributions (all authenticated users can contribute for now)

---

## Notes

**Key UX Principles:**
- **Search-First**: Always start with search to prevent duplicates
- **Minimal Friction**: Ask for name/title only, auto-fetch everything else
- **Transparent Automation**: Show users what we auto-populated so they trust the system
- **Graceful Degradation**: If Wikidata fails, fall back to manual form

**Technical Constraints:**
- Must preserve existing MediaWork Ingestion Protocol (Wikidata Q-ID canonical identifier)
- Must not break existing API contracts (other services may depend on them)
- Must handle Neo4j Aura connection gracefully (existing session management)

**Performance Considerations:**
- Wikidata API calls should have 5-second timeout
- Search should debounce to avoid excessive queries (500ms)
- Results should paginate if > 50 matches

**Accessibility:**
- All form fields must have proper labels
- Keyboard navigation must work for entire wizard
- Color contrast must meet WCAG AA standards
