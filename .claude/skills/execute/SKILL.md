---
name: execute
description: "Implement features precisely as planned. Executes implementation plans with progress tracking, adhering to existing patterns and best practices while updating the plan document dynamically."
---

# Execute Implementation

Now implement precisely as planned, in full.

## Implementation Requirements

**Code Quality:**
- Write elegant, minimal, modular code
- Adhere strictly to existing code patterns, conventions, and best practices
- Include thorough, clear comments/documentation within the code
- Follow the DRY principle (Don't Repeat Yourself)
- Ensure type safety and proper error handling

**Progress Tracking:**
As you implement each step:
- Update the markdown tracking document with emoji status (🟥 → 🟨 → 🟩)
- Update overall progress percentage dynamically
- Add completion timestamps for each task
- Document any deviations from the plan with rationale

## Execution Workflow

### Phase 1: Pre-Implementation Setup

Before writing any code:

1. **Read the Implementation Plan**
   - Locate plan file in `.plans/[feature-name]-implementation-plan.md`
   - Understand all tasks, dependencies, and success criteria
   - Confirm all critical decisions from exploration phase

2. **Review Existing Codebase Patterns**
   - Read relevant files identified in the plan
   - Note coding conventions (naming, structure, patterns)
   - Identify similar existing features to match patterns
   - Check for utility functions or abstractions to reuse

3. **Set Up Progress Tracking**
   - Open plan file for dynamic updates
   - Confirm initial state: all tasks 🟥, progress 0%
   - Ready to mark first task 🟨 when implementation begins

### Phase 2: Sequential Task Execution

For each task in the plan:

1. **Mark Task as In Progress**
   - Update task emoji: 🟥 → 🟨
   - Update plan file immediately
   - Note start time in task notes

2. **Implement the Task**
   - Follow the plan's subtasks exactly
   - Write code matching existing patterns
   - Add clear comments explaining non-obvious logic
   - Handle edge cases identified in exploration
   - Test as you go (manual verification)

3. **Mark Task as Complete**
   - Update task emoji: 🟨 → 🟩
   - Mark all subtasks as complete
   - Add completion timestamp
   - Update overall progress percentage
   - Document any deviations or issues encountered

4. **Verify Before Moving On**
   - Task meets acceptance criteria
   - No breaking changes to existing functionality
   - Code follows project conventions
   - Files saved and formatted

### Phase 3: Testing & Validation

After all implementation tasks:

1. **Execute Test Tasks from Plan**
   - Run manual tests defined in plan
   - Test edge cases identified in exploration
   - Verify success criteria from plan

2. **Integration Verification**
   - Ensure all phases work together
   - Test end-to-end user flow
   - Check for unintended side effects

3. **Update Final Status**
   - Mark all test tasks complete
   - Set progress to 100%
   - Add final completion notes

### Phase 4: Documentation & Cleanup

1. **Update Documentation**
   - Complete documentation tasks from plan
   - Add code comments where needed
   - Update relevant README files

2. **Review Implementation**
   - Compare against success criteria
   - Confirm no scope creep occurred
   - Verify all files from plan were modified

3. **Finalize Plan Document**
   - Add final notes section with summary
   - Document any deviations and rationale
   - Note any discovered issues for follow-up

## Code Quality Standards

### Follow Existing Patterns

**Example: If the codebase uses...**
```typescript
// Pattern: Named exports for utilities
export function getUserById(id: string) { ... }

// DO: Match this pattern
export function getMediaById(id: string) { ... }

// DON'T: Use different pattern
export default function getMedia(id: string) { ... }
```

### Comment Guidelines

**When to comment:**
- Complex algorithms or business logic
- Non-obvious decisions or trade-offs
- Workarounds for known issues
- Public API functions (JSDoc)

**When NOT to comment:**
- Obvious code that is self-explanatory
- What the code does (code should be clear)

**Good comments explain WHY, not WHAT:**
```typescript
// Good: Explains rationale
// Debounce localStorage writes to avoid excessive I/O during rapid toggles
const debouncedSave = debounce(saveToLocalStorage, 300);

// Bad: States the obvious
// Call debounce function with saveToLocalStorage and 300
const debouncedSave = debounce(saveToLocalStorage, 300);
```

### Error Handling

Match existing error handling patterns:

```typescript
// If codebase uses try-catch with specific error messages:
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  throw new Error('Data fetch failed');
}

// Match this pattern in your implementation
try {
  const theme = localStorage.getItem('theme-preference');
  return theme;
} catch (error) {
  console.error('Failed to read theme preference:', error);
  return 'light'; // Sensible default
}
```

### Type Safety

**ChronosGraph TypeScript patterns:**
```typescript
// Define interfaces for complex objects
interface ThemeContextValue {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

// Use explicit return types
export function getTheme(): 'light' | 'dark' {
  // implementation
}

// Avoid 'any' - use proper types
// Bad:
function processData(data: any) { ... }

// Good:
function processData(data: MediaWork) { ... }
```

## Progress Tracking Format

### Update Plan Document Live

As each task completes:

```markdown
**Overall Progress:** `25%` (2/8 tasks complete)

### Phase 1: Theme Infrastructure

- [x] 🟩 **Task 1.1: Create Theme Context**
  - [x] 🟩 Create `ThemeContext.tsx` with theme state and toggle function
  - [x] 🟩 Add localStorage read/write on mount/change
  - [x] 🟩 Detect and respect OS dark mode preference on first visit
  - **Completed**: 2026-01-19 15:30
  - **Notes**: Added debounce (300ms) to localStorage writes for performance
  - **Files Modified**:
    - `web-app/contexts/ThemeContext.tsx` (created, 87 lines)

- [x] 🟩 **Task 1.2: Wrap App in Theme Provider**
  - [x] 🟩 Import ThemeContext in root layout
  - [x] 🟩 Wrap children with ThemeProvider
  - [x] 🟩 Apply `dark` class to `<html>` tag conditionally
  - **Completed**: 2026-01-19 15:45
  - **Files Modified**:
    - `web-app/app/layout.tsx` (lines 12-15, 23-25)

- [ ] 🟨 **Task 2.1: Add Dark Mode Toggle to Navbar**
  - [x] 🟩 Create toggle icon component (sun/moon icons)
  - [ ] 🟨 Add toggle button to navbar dropdown (IN PROGRESS)
  - [ ] 🟥 Wire up to theme context toggle function
  - **Started**: 2026-01-19 15:50
  - **Notes**: Using lucide-react icons (Sun/Moon components)
```

### Progress Calculation

```
Overall Progress = (Completed Tasks / Total Tasks) × 100
Example: (2/8) × 100 = 25%
```

Update this percentage after **every task completion**.

## Handling Deviations from Plan

Sometimes reality differs from the plan:

### When Deviations Are Acceptable

**Minor changes:**
- Better variable name discovered during implementation
- Slightly different file structure makes more sense
- Optimization opportunity that maintains same behavior

**Document like this:**
```markdown
- [x] 🟩 **Task 1.1: Create Theme Context**
  - **Completed**: 2026-01-19 15:30
  - **Deviation**: Used `useCallback` for setTheme instead of plain function
  - **Rationale**: Prevents unnecessary re-renders in child components
  - **Impact**: None - same external API, better performance
```

### When Deviations Are Not Acceptable

**Major changes:**
- Adding features not in the plan (scope creep)
- Changing the approach without user approval
- Skipping success criteria or tests

**If you need to deviate significantly:**
1. STOP implementation
2. Document the issue discovered
3. Ask user for guidance
4. Update plan with user approval
5. Resume implementation

## Example Execution Session

```
User: "/execute"

Agent: "Starting implementation of Dark Mode Toggle feature.

Reading plan from `.plans/dark-mode-implementation-plan.md`...

Plan Summary:
- 8 tasks total across 3 phases
- Current progress: 0% (0/8 complete)
- Critical decisions: React Context, localStorage, all pages, light default

Beginning Phase 1: Theme Infrastructure..."

[Agent implements Task 1.1]

Agent: "✅ Task 1.1 Complete: Theme Context created

Files modified:
- `web-app/contexts/ThemeContext.tsx` (created, 87 lines)

Key implementation details:
- Uses React Context API with custom hook
- Reads/writes to localStorage key 'theme-preference'
- Detects OS dark mode preference via window.matchMedia
- Includes 300ms debounce on localStorage writes

Updated plan: Progress now 12.5% (1/8 tasks complete)

Moving to Task 1.2..."

[Agent continues through all tasks]

Agent: "✅ All implementation complete!

Final Status:
- Progress: 100% (8/8 tasks complete)
- All success criteria met:
  ✅ Dark mode toggle appears in navbar and is clickable
  ✅ Theme preference persists across page reloads
  ✅ All text remains readable in both modes
  ✅ OS dark mode preference detected on first visit
  ✅ Smooth transitions between modes

Files modified:
1. `web-app/contexts/ThemeContext.tsx` (created, 87 lines)
2. `web-app/app/layout.tsx` (modified, +12 lines)
3. `web-app/components/Navbar.tsx` (modified, +34 lines)
4. `web-app/app/page.tsx` (modified, +8 dark: variants)
[... all files listed ...]

Plan document updated with all completion timestamps.

Ready for testing and review."
```

## Integration with Other Skills

**Complete workflow:**
1. `/explore` → surfaces ambiguities
2. `/create-plan` → generates implementation plan
3. **`/execute`** → implements the plan (THIS SKILL)
4. `code-review-tester` agent → quality gates
5. Commit and ship

**Or via Chief-of-Staff CTO Mode:**
1. `/explore` + `/create-plan`
2. Chief-of-staff breaks into phases
3. **`/execute`** executes each phase
4. Phase review before proceeding
5. Final review and ship

## When to Use This Skill

**Use `/execute` when:**
- You have a complete, unambiguous implementation plan
- All exploration questions have been answered
- You're ready to write code, not explore or plan
- You want automated progress tracking

**Don't use `/execute` when:**
- Plan is incomplete or has unresolved questions
- You want to explore alternatives during implementation
- Requirements might change mid-implementation
- It's a trivial change (just implement directly)

## Success Criteria

After `/execute` completes:

✅ All tasks in plan marked 🟩 with completion timestamps
✅ Progress shows 100%
✅ All success criteria from plan are met
✅ Code follows existing patterns and conventions
✅ Comments explain complex or non-obvious logic
✅ All files identified in plan have been modified
✅ Plan document updated with deviations and notes
✅ Feature works as specified in exploration phase

## Anti-Patterns (Don't Do This)

❌ Starting implementation without reading the plan fully
❌ Adding features not in the plan ("while I'm here...")
❌ Forgetting to update progress after each task
❌ Skipping tests defined in the plan
❌ Not documenting deviations from the plan
❌ Using different patterns than existing codebase
❌ Implementing all tasks before updating any progress
❌ Ignoring edge cases identified in exploration

## File Management

**Plan file location:**
`.plans/[feature-name]-implementation-plan.md`

**Update strategy:**
- Read plan at start
- Open plan file for editing
- Update after each task completion
- Save plan file immediately after updates
- Final save with completion summary

**Backup consideration:**
If implementation fails partway, the plan document shows exactly what was completed and what remains, enabling easy resumption.

## Emergency Handling

**If implementation reveals a blocking issue:**

1. **Stop and document:**
   ```markdown
   - [ ] 🟥 **Task 2.1: Add API Endpoint**
     - **Status**: BLOCKED
     - **Issue**: Discovered Neo4j 5.x deprecates syntax used in plan
     - **Impact**: Cannot proceed with current approach
     - **Next Steps**: Need to consult data-architect agent for Neo4j 5.x equivalent
   ```

2. **Update progress accurately:**
   - Don't mark as complete if blocked
   - Keep as 🟨 or revert to 🟥
   - Update overall progress to reflect reality

3. **Communicate to user:**
   "⚠️ Implementation blocked at Task 2.1: [describe issue]

   Need guidance on: [specific question]

   Current progress: 37.5% (3/8 tasks complete)
   All completed tasks are stable and tested."

4. **Wait for resolution before continuing**

## Performance Considerations

**Optimize as you implement:**
- Reuse existing utility functions
- Avoid unnecessary re-renders (React)
- Use appropriate data structures
- Cache expensive computations
- Limit database query results

**But don't over-optimize:**
- Premature optimization is evil
- Profile before optimizing
- Readability > micro-optimizations
- Follow plan's specified approach

## Final Checklist

Before marking implementation complete:

- [ ] All tasks marked 🟩 with timestamps
- [ ] Progress shows 100%
- [ ] All success criteria met
- [ ] Code follows existing patterns
- [ ] Comments added where needed
- [ ] Edge cases handled
- [ ] Tests passing (if automated tests exist)
- [ ] Manual testing completed
- [ ] Plan document fully updated
- [ ] Deviations documented with rationale
- [ ] Files saved and formatted
- [ ] Ready for code review