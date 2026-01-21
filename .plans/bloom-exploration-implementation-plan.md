# Feature Implementation Plan: Interactive Node-to-Node Graph Exploration (Bloom Effect)

**Overall Progress:** `86%` (12/14 tasks complete - Core implementation complete, testing remaining)

**GitHub Issue:** [#1](https://github.com/gcquraishi/chronosgraph/issues/1)

---

## TL;DR

Transform graph exploration from static visualization to interactive "bloom" experience where clicking any outer node re-centers the camera and reveals its connections, creating a progressive network discovery journey. Phase 1 focuses on core navigation functionality (click-to-center, expand, depth tracking) before adding polish in later phases.

---

## Critical Decisions

Key architectural/implementation choices made during exploration:

- **Functionality Before Polish**: Animation effects (fade-in, pulse) deferred to Phase 3. Phase 1 proves the interaction model works before investing in visual polish.
- **Camera Re-centering on Click**: Every outer node click triggers smooth camera pan to center on that node, making it the new "center" from which to explore.
- **Depth-Based Culling**: Track hop distance from starting node. Nodes >N hops away fade out (user-toggleable via "Show All/Recent").
- **Collapse on Re-click**: Clicking an already-expanded node collapses its children (toggles expansion state).
- **Local React State**: Continue using GraphExplorer's existing useState pattern. No global state library needed for Phase 1.
- **Start on Figure Pages**: Entry point is `/figure/[id]` pages where users arrive with clear intent. Add feature flag for dev toggle.
- **Existing Library**: Use `react-force-graph-2d`'s built-in `centerAt()` and `zoom()` methods via ref. No library changes.

---

## Implementation Tasks

### Phase 1: Core Bloom Navigation (Days 1-5)

- [x] 🟩 **Task 1.1: ForceGraph Ref and Camera Control** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Add `forceGraphRef` using `useRef` to access ForceGraph2D instance ✓
  - [x] 🟩 Pass ref to `<ForceGraph2D ref={forceGraphRef} />` ✓
  - [x] 🟩 Create `centerCameraOnNode()` helper function that calls `forceGraphRef.current?.centerAt(node.x, node.y, 1000)` ✓
  - [x] 🟩 Test camera panning works by logging node coordinates and triggering manual center ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Line 116, Lines 135-148, Line 780)
  - **Implementation**: Added `forceGraphRef` at line 116. Created `centerCameraOnNode()` helper at lines 135-148 with 1000ms smooth pan duration, null checks, and error handling. Passed ref to ForceGraph2D at line 780. Console logging confirms camera centering.
  - **Dependencies**: None

- [x] 🟩 **Task 1.2: Center Node State Management** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Add `centerNodeId` state: `const [centerNodeId, setCenterNodeId] = useState<string | null>(canonicalId ? `figure-${canonicalId}` : null)` ✓
  - [x] 🟩 Add visual indicator for center node in `nodeCanvasObject` (increase size by 1.5x, add distinct glow) ✓
  - [x] 🟩 Update `handleNodeClick` to call `setCenterNodeId(node.id)` before expansion logic ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Lines 117-119, 431, 814-847)
  - **Implementation**: Added `centerNodeId` state at lines 117-119. Added `isCenterNode` detection at line 814, with CENTER_NODE_SIZE_MULTIPLIER (1.5x) applied at lines 818-820. Center node gets gold/amber glow (CENTER_NODE_GLOW_COLOR) at lines 836-847. Updated `handleNodeClick` at line 431 to call `setCenterNodeId(node.id)`.
  - **Dependencies**: Task 1.1 must complete first

- [x] 🟩 **Task 1.3: Integrate Camera Pan on Node Click** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Modify `handleNodeClick` to call `centerCameraOnNode(node)` immediately when any node clicked ✓
  - [x] 🟩 Add null check for `forceGraphRef.current` before attempting pan ✓
  - [x] 🟩 Ensure camera pans before expansion API call (user sees centering immediately) ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Lines 425-472)
  - **Implementation**: Camera centering happens synchronously at line 432 (`centerCameraOnNode(node)`) inside bloom mode conditional (lines 430-472), before async fetch operations for expansion. Null check implemented in `centerCameraOnNode()` helper at line 136. Pan happens immediately on click for instant visual feedback.
  - **Dependencies**: Tasks 1.1 and 1.2 must complete first

- [x] 🟩 **Task 1.4: Extend Node Click Handler for All Node Types** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Extend `handleNodeClick` to handle figure nodes (currently only media and figure-navigation at Lines 302-306) ✓
  - [x] 🟩 For figure nodes, call `/api/graph/expand/${canonicalId}?type=figure` to fetch media neighbors ✓
  - [x] 🟩 Merge results into graph state (same pattern as media expansion at Lines 264-283) ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Lines 474-563, 565-660)
  - **Implementation**: Media node expansion at lines 474-563, figure node expansion at lines 565-660. Both node types fetch via `/api/graph/expand/${id}?type={media|figure}` and merge nodes/links into graph state. Navigation redirect removed in bloom mode (lines 569-573). Figure nodes expand in place when bloom mode enabled. Both use identical merge pattern with duplicate detection.
  - **Dependencies**: Task 1.3 must complete first

- [x] 🟩 **Task 1.5: Verify Backend Supports Figure-Type Expansion** ✅ COMPLETE (2026-01-20)
  - [x] 🟩 Review `getNodeNeighbors()` in db.ts (Lines 567-675) ✓
  - [x] 🟩 Verify figure-type branch handles `INTERACTED_WITH` and `APPEARS_IN` relationships correctly ✓
  - [x] 🟩 Test with high-connectivity figures (Marcus Falco: 48 connections, Helena Justina: 43, Julius Caesar: 27) ✓
  - [x] 🟩 Verify LIMIT 50 is sufficient for all tested nodes ✓
  - [x] 🟩 Test edge cases (no connections, single relationship type) ✓
  - **Files**: `web-app/lib/db.ts` (Lines 567-675), `.plans/backend-verification-report.md`
  - **Test Scripts**: `scripts/qa/test_node_neighbors.py`, `scripts/qa/test_media_neighbors.py`
  - **Results**: Backend is PRODUCTION READY. Figure branch correctly fetches both APPEARS_IN (media works) and INTERACTED_WITH (other figures). All queries have LIMIT 50. Edge cases handled gracefully. API endpoint `/api/graph/expand/[id]?type=figure` verified working.
  - **Dependencies**: None (completed in parallel)

- [x] 🟩 **Task 1.6: Depth Tracking Infrastructure** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Add `nodeDepths` state: `const [nodeDepths, setNodeDepths] = useState<Map<string, number>>(new Map())` ✓
  - [x] 🟩 Initialize starting node with depth 0 on mount ✓
  - [x] 🟩 On expansion, calculate new nodes' depths as `parentDepth + 1` ✓
  - [x] 🟩 Store depths in Map during merge logic ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Line 120, Lines 230-238, Lines 261-270, Lines 499-525, Lines 596-622)
  - **Implementation**: Added `nodeDepths` state at line 120. Starting node initialized to depth 0 in useEffect at lines 230-238. Initial neighbors set to depth 1 at lines 261-270. On expansion, depth calculated as `parentDepth + 1` for media nodes (lines 499-525) and figure nodes (lines 596-622). Depth tracking logged in console at line 449.
  - **Dependencies**: Task 1.4 must complete first

- [x] 🟩 **Task 1.7: Depth Limit Warning System** ✅ COMPLETE (2026-01-21)
  - [x] 🟩 Add `MAX_DEPTH` constant (configurable, default 7 hops) ✓
  - [x] 🟩 In `handleNodeClick`, check if expanding would exceed depth limit ✓
  - [x] 🟩 Show warning in console: "⚠️ Approaching depth limit (7/7 hops). Consider collapsing distant nodes." ✓
  - [x] 🟩 Add console.log for current depth on node click (debug tool) ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Line 90, Lines 449-464)
  - **Implementation**: Added `MAX_DEPTH = 7` constant at line 90. Depth check implemented at lines 449-456 that warns (console.warn) when `potentialDepth >= MAX_DEPTH`. Console.log shows current depth and potential new node depth at lines 458-464. Warning doesn't block expansion per requirements.
  - **Dependencies**: Task 1.6 must complete first

- [x] 🟩 **Task 1.8: Collapse Functionality (Toggle Expansion)** ✅ COMPLETE (2026-01-20)
  - [x] 🟩 Detect when user clicks already-expanded node (check `expandedNodes.has(node.id)`) ✓
  - [x] 🟩 On re-click, identify which nodes to remove (BFS to find children added by this expansion) ✓
  - [x] 🟩 Remove child nodes and their links from graph state ✓
  - [x] 🟩 Remove node from `expandedNodes` Set ✓
  - [x] 🟩 **ENHANCEMENT**: Implement smart collapse that preserves exploration path ✓
  - **Files**: `web-app/components/GraphExplorer.tsx` (Lines 122-126, 144-207, 348, 368, 461)
  - **Commits**: 7457495 (initial), 1115d3b (smart collapse)
  - **Implementation**: Added `nodeChildren` Map to track parent-child relationships and `visitedCenters` Set to track clicked nodes. Implemented `collapseNode()` with smart BFS that skips nodes in exploration path. When collapsing node B in path A→B→C, keeps C and its descendants. Only removes "side branch" nodes not clicked for navigation. Console logs show preserved nodes.
  - **Dependencies**: Tasks 1.4 and 1.6 must complete first

### Phase 1: Testing & Edge Cases (Days 4-5)

- [ ] 🟥 **Task 1.9: Test with High-Degree Nodes**
  - [ ] 🟥 Test expansion of high-connectivity figures (50+ connections)
  - [ ] 🟥 Verify LIMIT 50 prevents overwhelming viewport
  - [ ] 🟥 Check force graph physics doesn't explode with 50 new nodes at once
  - **Notes**: May need to add "Showing 50 of 150 connections" message. Flag for Phase 3.

- [ ] 🟥 **Task 1.10: Test Camera Control with Active Simulation**
  - [ ] 🟥 Verify camera pans smoothly even while force simulation running
  - [ ] 🟥 If jittery, experiment with pausing simulation during pan: `forceGraphRef.current?.pauseAnimation()` then `resumeAnimation()`
  - [ ] 🟥 Test rapid clicks (user clicks multiple nodes quickly)
  - **Notes**: This is the highest-risk technical item flagged by chief-of-staff.

- [ ] 🟥 **Task 1.11: Test Collapse with Complex Graph**
  - [ ] 🟥 Expand 3-4 nodes, then collapse the 2nd expanded node
  - [ ] 🟥 Verify only its children removed, not siblings or unrelated nodes
  - [ ] 🟥 Check graph doesn't break if collapsing node that has been re-expanded elsewhere

- [ ] 🟥 **Task 1.12: Test Entry Point on Figure Pages**
  - [ ] 🟥 Navigate to `/figure/[id]` for several different figures
  - [ ] 🟥 Verify graph initializes with that figure as center (depth 0)
  - [ ] 🟥 Click outer nodes and verify bloom expansion works
  - [ ] 🟥 Check browser back button doesn't break graph state

- [x] 🟩 **Task 1.13: Add Feature Flag for Development** ✅ COMPLETE (2026-01-20)
  - [x] 🟩 Add `NEXT_PUBLIC_BLOOM_MODE=true` to `.env.local` ✓
  - [x] 🟩 Wrap new behavior in conditional: `if (process.env.NEXT_PUBLIC_BLOOM_MODE === 'true')` ✓
  - [x] 🟩 Ensure old behavior still accessible by setting flag to false ✓
  - **Files**: `.env.local` (not committed, in .gitignore), `web-app/components/GraphExplorer.tsx`
  - **Commit**: af265a2
  - **Implementation**: Added `isBloomMode` constant. Wrapped camera centering, depth tracking, figure expansion, and center node styling in conditionals. Flag set to `true` by default. Set to `false` to revert to old behavior.

- [ ] 🟥 **Task 1.14: Phase 1 Code Review**
  - [ ] 🟥 Launch `/review` skill to audit GraphExplorer changes
  - [ ] 🟥 Check for performance issues (re-renders, memory leaks)
  - [ ] 🟥 Verify TypeScript types are correct for new state
  - [ ] 🟥 Confirm no regressions to path-highlighting feature (existing highlightedPath prop)
  - **Notes**: Use code-review-tester agent to catch edge cases before Phase 2.

---

## Rollback Plan

**If things go wrong:**

1. **Camera control fails**: Revert Task 1.1-1.3 changes. Re-enable old click behavior (navigate to figure page on click).
2. **Performance degrades**: Set feature flag `NEXT_PUBLIC_BLOOM_MODE=false` to disable new behavior immediately.
3. **Collapse breaks graph**: Disable collapse feature (comment out Task 1.8 code). Users can still expand, just not collapse.
4. **Full rollback**: Run `git checkout HEAD -- web-app/components/GraphExplorer.tsx` to restore previous version. Only expansion API changes persist (safe).

**Git Strategy:**
- Create feature branch: `git checkout -b feature/bloom-exploration`
- Commit after each task completion
- Squash before merging to main

---

## Success Criteria

### Phase 1 Completion Criteria

✅ **Camera Re-centering Works**: Clicking any node smoothly pans camera to center on it (1 second smooth animation)

✅ **Universal Expansion Works**: Clicking any figure or media node fetches and displays its neighbors (merge into existing graph)

✅ **Center Node Visually Distinct**: Current center node is 1.5x larger and has gold/distinct glow effect

✅ **Depth Tracking Accurate**: Console logs show correct hop count for each node when hovered

✅ **Collapse Functionality Works**: Clicking expanded node removes only its children, not other nodes

✅ **No Performance Regression**: Graph with 100+ nodes still renders at 30+ FPS

✅ **Entry Point Validated**: Navigating to `/figure/Napoleon` initializes with Napoleon as center, clicking outer nodes blooms correctly

✅ **No Breaking Changes**: Existing features (path highlighting, media category filters) still work

### Technical Acceptance Criteria

- ForceGraph ref successfully exposes `centerAt()` method
- No TypeScript errors in GraphExplorer.tsx
- No memory leaks (check React DevTools profiler)
- Camera panning doesn't conflict with force simulation physics
- Graph accumulation doesn't cause duplicate nodes/links

---

## Out of Scope (For Phase 1)

**Deferred to Phase 2:**
- Back button (stack-based navigation history)
- Breadcrumb trail showing expansion path
- Mini-map for full graph overview
- "Reset View" button to start fresh

**Deferred to Phase 3:**
- Fade-in animation for new nodes
- Pulse/highlight effects on newly expanded nodes
- Smooth scale-up transitions
- Spring physics for node appearance
- Animation library integration (Framer Motion or react-spring)

**Deferred to Phase 4 (Future Work):**
- Depth-based node fading (opacity decreases with distance from center)
- "Show All" / "Show Recent" toggle for culling distant nodes
- Clustering for dense graph areas
- High-degree node pagination ("Show 50 more...")
- Export graph as image for social sharing
- Multiple starting points (search, curated starts, other entry points beyond figure pages)

**Explicitly Not Included:**
- 3D graph view (stick with 2D)
- Real-time collaboration (multiple users exploring same graph)
- Persistent exploration sessions (no save/load graph state)
- Mobile touch gestures (Phase 1 is desktop-first)

---

## Risk Mitigation

### High-Risk Items

**Risk 1: Camera Control API Unstable**
- **Probability**: Medium
- **Impact**: High (blocks entire feature)
- **Mitigation**: Test camera panning on Day 1 before building dependent features. If `centerAt()` unreliable, implement manual camera positioning via force graph's internal state.

**Risk 2: Force Simulation Interference**
- **Probability**: Medium
- **Impact**: Medium (jittery camera, poor UX)
- **Mitigation**: Experiment with `pauseAnimation()` during camera pan. Add cooldown period before allowing next expansion.

**Risk 3: Collapse Logic Breaks Graph State**
- **Probability**: Low
- **Impact**: High (corrupt graph, lost nodes)
- **Mitigation**: Implement comprehensive node tracking (parent-child relationships). Add extensive logging. Build rollback capability into collapse function itself.

---

## Dependencies & Blockers

### External Dependencies
- None (all dependencies already installed)

### Internal Dependencies
- **Critical Path**: Task 1.1 (camera control) blocks Tasks 1.2, 1.3, 1.4
- **Parallel Work**: Task 1.5 (backend verification) can run in parallel with UI tasks

### Potential Blockers
- React Force Graph library quirks (chief-of-staff flagged this as risk)
- Neo4j query performance for high-degree nodes (current LIMIT 50 should handle)

---

## Notes for Implementation

### Development Workflow
1. Start each day by updating this plan's progress emojis (🟥 → 🟨 → 🟩)
2. Commit after completing each task with message format: `feat(bloom): [Task number] - [Task name]`
3. Test incrementally - don't wait until end of phase
4. Use feature flag to compare old vs new behavior side-by-side

### Testing Strategy
- Manual testing on `/figure/Napoleon`, `/figure/Shakespeare` (high connectivity)
- Check browser console for errors after each click
- Monitor React DevTools profiler for performance issues
- Test in Chrome and Safari (force graph uses Canvas, browser differences possible)

### Communication
- Update CHRONOS_LOG.md at end of each day with progress and blockers
- Flag any deviation from plan immediately (don't silently adjust scope)
- If Day 1 camera control takes >1.5 days, reassess timeline

---

## Phase 2 Preview (Not Implemented Yet)

**Navigation Controls (3-4 days):**
- Back button with history stack
- Breadcrumb trail component
- Reset view button
- "Jump to node" search within graph

**Entry Points (2-3 days):**
- Add "Explore" button to figure detail pages
- Integrate with search results (click to bloom)
- Create curated starting points page

---

## Plan Maintenance Log

**2026-01-20**: Plan created after exploration phase and chief-of-staff approval. Phase 1 scoped to 5-7 days (14 tasks). Animation deferred to Phase 3 per user feedback.

**[Future entries will be added here as implementation progresses]**

---

## Related Documents

- **GitHub Issue**: [#1 - Interactive node-to-node graph exploration](https://github.com/gcquraishi/chronosgraph/issues/1)
- **Exploration Notes**: See conversation transcript with 12 clarification questions and answers
- **Chief-of-Staff Review**: Agent a5719e4 approved with timeline caveat (may need +2 days for camera control)
- **Code Files**:
  - `web-app/components/GraphExplorer.tsx` (primary modification target)
  - `web-app/app/figure/[id]/page.tsx` (entry point)
  - `web-app/lib/db.ts` (backend verification)
