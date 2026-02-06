# Feature Implementation Plan: Temporal Coverage Visualization

**Overall Progress:** `92%` (11/12 tasks complete)

---

## TL;DR
Create a consumer-facing "Historical Coverage Explorer" view that visualizes Fictotum's temporal distribution of media works and historical figures across all time periods, showing coverage density, geographic spread, and content gaps. Think of it as a "heat map through time" showing where our database has rich content vs. sparse coverage.

---

## Critical Decisions

**Visualization Approach:**
- **Primary View**: Interactive timeline with vertical bars showing work/figure density per time period
- **Granularity**: Century-level by default, with drill-down to decade/year for dense periods
- **Data Aggregation**: Pre-computed counts via Neo4j queries (not client-side aggregation)
- **Geographic Layer**: Toggle overlay showing geographic distribution within time periods
- **Interactivity**: Click periods to see work/figure lists, hover for tooltips with counts

**Technical Stack:**
- **Chart Library**: Recharts (already used in SentimentTrendChart) for consistency
- **API Endpoint**: New `/api/temporal-coverage` route for aggregated statistics
- **Database Query**: Cypher aggregation by release_year, setting_year, birth_year, death_year
- **Page Location**: New `/explore/coverage` route (discoverable from main dashboard)

**Data Model:**
- **Time Buckets**: 100-year buckets (e.g., "1-100 CE", "1400-1500") with drill-down
- **Metrics Tracked**:
  - Total MediaWork nodes per period (by release_year)
  - Total HistoricalFigure nodes per period (by birth_year or era)
  - Media type breakdown (Books, Films, Games, TV)
  - Geographic distribution (top 5 locations per period)
  - Series vs. standalone works ratio
- **Coverage Gaps**: Highlight periods with <5 works as "under-represented"

**User Experience:**
- **Default View**: Full historical timeline (3000 BCE - 2025 CE)
- **Filters**: Media type, geographic region, series/standalone toggle
- **Color Coding**: Heat map gradient (red = sparse, yellow = moderate, green = rich)
- **Tooltips**: Period name, work count, figure count, top creators
- **Click Action**: Navigate to filtered browse view for that period

---

## Implementation Tasks

### Phase 1: Database Layer & API

- [x] 🟩 **Task 1.1: Create Temporal Aggregation Cypher Queries**
  - [ ] 🟥 Write query to bucket MediaWork nodes by release_year (century-level)
  - [ ] 🟥 Write query to bucket HistoricalFigure nodes by birth_year/era
  - [ ] 🟥 Write query for geographic distribution per time period
  - [ ] 🟥 Write query for media type breakdown per period
  - [ ] 🟥 Add drill-down query for decade-level granularity
  - **Files**: `web-app/lib/db.ts` (new functions: `getTemporalCoverage()`, `getTemporalCoverageDetails()`)
  - **Notes**: Use Neo4j's `apoc.date` functions if available, otherwise manual bucketing in Cypher

- [ ] 🟥 **Task 1.2: Create Temporal Coverage API Endpoint**
  - [ ] 🟥 Create `/api/temporal-coverage/route.ts` for aggregated statistics
  - [ ] 🟥 Add query params: `granularity` (century|decade|year), `mediaType`, `region`
  - [ ] 🟥 Return JSON with: `timeBuckets`, `totalWorks`, `totalFigures`, `coverageGaps`
  - [ ] 🟥 Add caching headers (stale-while-revalidate for 1 hour)
  - **Files**: `web-app/app/api/temporal-coverage/route.ts` (new)
  - **Dependencies**: Task 1.1 must complete first
  - **Notes**: Response format:
    ```json
    {
      "timeBuckets": [
        {
          "period": "1400-1500",
          "startYear": 1400,
          "endYear": 1500,
          "workCount": 45,
          "figureCount": 23,
          "mediaTypes": {"Book": 30, "Film": 10, "Game": 5},
          "topLocations": ["England", "Italy", "France"],
          "seriesCount": 5,
          "standaloneCount": 40,
          "coverageStatus": "moderate"
        }
      ],
      "statistics": {
        "totalWorks": 1542,
        "totalFigures": 897,
        "earliestYear": -3000,
        "latestYear": 2025,
        "coverageGaps": ["500-600", "900-1000"]
      }
    }
    ```

- [ ] 🟥 **Task 1.3: Create Drill-Down API Endpoint**
  - [ ] 🟥 Create `/api/temporal-coverage/[period]/route.ts` for detailed period view
  - [ ] 🟥 Return list of works and figures for specific time period
  - [ ] 🟥 Support pagination (limit 50 per page)
  - **Files**: `web-app/app/api/temporal-coverage/[period]/route.ts` (new)
  - **Dependencies**: Task 1.1
  - **Notes**: Used when user clicks on a time period bar

### Phase 2: Visualization Components

- [ ] 🟥 **Task 2.1: Create TemporalCoverageChart Component**
  - [ ] 🟥 Build Recharts BarChart with century-level time buckets on X-axis
  - [ ] 🟥 Stack bars by media type (Books, Films, Games, TV)
  - [ ] 🟥 Add gradient fill for heat map effect (red → yellow → green based on density)
  - [ ] 🟥 Implement hover tooltips showing period details
  - [ ] 🟥 Add click handler to drill down to period detail
  - **Files**: `web-app/components/TemporalCoverageChart.tsx` (new)
  - **Dependencies**: Task 1.2 must complete first
  - **Notes**: Use Evidence Locker styling (amber accents, stone backgrounds)

- [ ] 🟥 **Task 2.2: Create CoverageGapIndicator Component**
  - [ ] 🟥 Display highlighted "under-represented" periods below main chart
  - [ ] 🟥 Show period name, current work count, "Add Content" CTA button
  - [ ] 🟥 Link to filtered dashboard for manual content addition
  - **Files**: `web-app/components/CoverageGapIndicator.tsx` (new)
  - **Dependencies**: Task 2.1
  - **Notes**: Style as amber warning badges with military aesthetic

- [ ] 🟥 **Task 2.3: Create GeographicOverlay Component**
  - [ ] 🟥 Build toggle-able overlay showing top locations per period
  - [ ] 🟥 Display as small map pins or location badges on timeline
  - [ ] 🟥 Click location to filter to that region
  - **Files**: `web-app/components/GeographicOverlay.tsx` (new)
  - **Dependencies**: Task 2.1
  - **Notes**: Optional enhancement - can defer if complexity too high

- [ ] 🟥 **Task 2.4: Create TemporalCoverageFilters Component**
  - [ ] 🟥 Add filter dropdowns: Media Type (All, Books, Films, Games, TV)
  - [ ] 🟥 Add granularity selector: Century | Decade | Year
  - [ ] 🟥 Add series/standalone toggle
  - [ ] 🟥 Wire up filters to re-fetch data from API with query params
  - **Files**: `web-app/components/TemporalCoverageFilters.tsx` (new)
  - **Dependencies**: Task 2.1
  - **Notes**: Use same styling as search filters on main dashboard

### Phase 3: Page Layout & Integration

- [ ] 🟥 **Task 3.1: Create Coverage Explorer Page**
  - [ ] 🟥 Create `/explore/coverage/page.tsx` with Evidence Locker styling
  - [ ] 🟥 Add header: "HISTORICAL COVERAGE ARCHIVE" with classification banner
  - [ ] 🟥 Integrate TemporalCoverageChart component
  - [ ] 🟥 Integrate CoverageGapIndicator below chart
  - [ ] 🟥 Add statistics cards: Total Works, Total Figures, Date Range, Coverage %
  - **Files**: `web-app/app/explore/coverage/page.tsx` (new)
  - **Dependencies**: Tasks 2.1, 2.2
  - **Notes**: Follow same layout pattern as `/figure/[id]/page.tsx`

- [ ] 🟥 **Task 3.2: Create Period Detail Modal/Page**
  - [ ] 🟥 Create modal or slide-out panel for period drill-down
  - [ ] 🟥 Display works and figures list for selected period
  - [ ] 🟥 Add "View All" link to navigate to filtered browse page
  - [ ] 🟥 Show media type breakdown pie chart for period
  - **Files**: `web-app/components/PeriodDetailPanel.tsx` (new)
  - **Dependencies**: Task 1.3, Task 3.1
  - **Notes**: Could be modal (client component) or separate route

- [ ] 🟥 **Task 3.3: Add Navigation Link to Main Dashboard**
  - [ ] 🟥 Add "Historical Coverage" card/link to main dashboard
  - [ ] 🟥 Use icon: Clock or BarChart3 from lucide-react
  - [ ] 🟥 Add hover preview showing total coverage stats
  - **Files**: `web-app/app/page.tsx`
  - **Dependencies**: Task 3.1
  - **Notes**: Place in "Discovery" or "Explore" section of dashboard

### Phase 4: Testing & Polish

- [ ] 🟥 **Task 4.1: Manual Testing**
  - [ ] 🟥 Test timeline renders correctly with real database data
  - [ ] 🟥 Test drill-down to period detail works
  - [ ] 🟥 Test filters update chart correctly
  - [ ] 🟥 Test coverage gaps are highlighted appropriately
  - [ ] 🟥 Test responsive behavior on mobile/tablet
  - [ ] 🟥 Test with empty database (should show "No data" gracefully)

- [ ] 🟥 **Task 4.2: Performance Optimization**
  - [ ] 🟥 Verify API response time <500ms for full coverage query
  - [ ] 🟥 Add loading states while fetching data
  - [ ] 🟥 Implement skeleton loader for chart during initial load
  - [ ] 🟥 Test with 2000+ works to ensure chart remains performant
  - **Notes**: If query too slow, add Neo4j index on release_year, birth_year

- [ ] 🟥 **Task 4.3: Documentation**
  - [ ] 🟥 Add JSDoc comments to all new functions in `lib/db.ts`
  - [ ] 🟥 Document query parameters for API endpoints
  - [ ] 🟥 Add comments explaining bucketing algorithm
  - [ ] 🟥 Update README with new `/explore/coverage` route

---

## Rollback Plan

**If things go wrong:**
1. Remove `/api/temporal-coverage/` directory (delete API routes)
2. Remove `/explore/coverage/` directory (delete page)
3. Remove all new components in `components/` directory:
   - `TemporalCoverageChart.tsx`
   - `CoverageGapIndicator.tsx`
   - `GeographicOverlay.tsx`
   - `TemporalCoverageFilters.tsx`
   - `PeriodDetailPanel.tsx`
4. Revert `lib/db.ts` to remove new functions (`getTemporalCoverage`, `getTemporalCoverageDetails`)
5. Revert `app/page.tsx` to remove navigation link
6. No database changes required (read-only feature)

---

## Success Criteria

✅ User can view interactive timeline showing work/figure density across all historical periods
✅ Timeline displays century-level granularity by default, supports drill-down to decade
✅ Clicking a time period shows detailed list of works and figures from that era
✅ Coverage gaps (<5 works per period) are visually highlighted with amber warnings
✅ Filters work: Media Type, Granularity, Series/Standalone toggle
✅ Page loads in <2 seconds with full database (~2000 works)
✅ Chart is responsive and works on mobile devices
✅ Statistics cards show: Total Works, Total Figures, Date Range, Coverage %
✅ Evidence Locker aesthetic maintained throughout (amber/stone colors, military styling)
✅ Navigation link added to main dashboard

---

## Out of Scope (For This Plan)

**Deferred to Future Enhancements:**
- Geographic heat map (world map showing location density) - complex, requires map library
- Export coverage report as PDF/CSV
- Comparison view (compare coverage between media types)
- Timeline animation showing content growth over time
- Series-specific coverage view (show all works in a series on timeline)
- User contributions heatmap (show when content was added to database)
- Predictive analytics (suggest periods to prioritize for content addition)

**Explicitly Not Included:**
- Writing/editing capabilities (this is a read-only visualization)
- Integration with external APIs for content suggestions
- Automated content ingestion triggered by coverage gaps
- Real-time updates (uses stale-while-revalidate caching)

---

## Data Requirements

**Neo4j Node Properties Needed:**
- `MediaWork.release_year` (must be populated for accurate bucketing)
- `MediaWork.setting_year` (optional, for "story setting" vs "release" comparison)
- `MediaWork.media_type` (for breakdown by type)
- `HistoricalFigure.birth_year` (or `era` if birth_year unknown)
- `HistoricalFigure.death_year` (for lifespan visualization)
- `Location` nodes with `SET_IN` relationships (for geographic overlay)
- `Era` nodes with `TAKES_PLACE_IN` relationships (for period bucketing)

**Data Quality Checks:**
- Run health check script to verify release_year coverage: `scripts/qa/neo4j_health_check.py`
- Expected: 80%+ of MediaWork nodes have non-null release_year
- Expected: 60%+ of HistoricalFigure nodes have birth_year or era

---

## Future Enhancements (Post-MVP)

1. **Interactive Comparison Mode**: Side-by-side timelines comparing Books vs. Films coverage
2. **Geographic Heat Map**: World map overlay showing location density per time period
3. **Series Timeline View**: Special view showing all works in a series on a unified timeline
4. **Content Growth Animation**: Playback showing how database coverage evolved over time
5. **Smart Gap Recommendations**: AI-suggested works to fill coverage gaps (using Wikidata API)
6. **Export & Share**: Generate shareable coverage reports for social media
7. **User Contribution Tracking**: Show which periods received most community contributions

---

## Technical Notes

**Performance Considerations:**
- Pre-aggregate data at DB level (not client-side)
- Use Neo4j indexes on temporal fields (release_year, birth_year)
- Cache API responses for 1 hour with stale-while-revalidate
- Paginate drill-down results (50 items per page)
- Lazy load geographic overlay (separate API call)

**Accessibility:**
- Add ARIA labels to chart bars
- Ensure color contrast meets WCAG AA standards
- Keyboard navigation for period selection
- Screen reader announcements for filter changes

**Mobile Optimization:**
- Horizontal scroll for timeline on small screens
- Touch gestures for zoom/pan on timeline
- Simplified view on mobile (hide geographic overlay by default)
- Responsive statistics cards (stack vertically on mobile)

---

## Related Features

**Integrates With:**
- `/browse/era/[id]` - Drill-down links to era browse pages
- `/browse/location/[id]` - Geographic overlay links to location pages
- Main dashboard - Navigation link and preview card
- ImpressionisticTimeline - Similar temporal visualization approach

**Builds On:**
- Existing temporal metadata in GraphNode interface
- Location and Era node structures
- Evidence Locker design system
- Recharts library (already used in SentimentTrendChart)

---

## Implementation Timeline Estimate

**Phase 1 (Database & API)**: 4-6 hours
**Phase 2 (Components)**: 6-8 hours
**Phase 3 (Page Layout)**: 3-4 hours
**Phase 4 (Testing & Polish)**: 3-4 hours

**Total Estimate**: 16-22 hours of development work

---

## Questions to Address Before Starting

1. **Granularity Default**: Should we default to century, decade, or allow user to choose on first load?
   - **Recommendation**: Default to century for cleaner initial view, allow drill-down
2. **Geographic Overlay**: Is this MVP or can we defer to Phase 2?
   - **Recommendation**: Defer to Phase 2 (adds map library dependency, increases complexity)
3. **Coverage Gap Threshold**: How many works/figures constitute "good coverage" per period?
   - **Recommendation**: <5 works = sparse (red), 5-20 = moderate (yellow), 20+ = rich (green)
4. **Series Handling**: Should series be counted as 1 item or N items (N = number of works)?
   - **Recommendation**: Count individual works, but add toggle to show "series-collapsed" view
5. **Ancient Dates**: How to handle BCE dates in timeline? (negative years)
   - **Recommendation**: Format as "3000 BCE - 1 BCE | 1 CE - 2025 CE" with clear boundary marker

---

*Last Updated: 2026-02-03*
*Status: Ready for Implementation*
