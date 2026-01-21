---
name: create-plan
description: "Generate a clear, minimal implementation plan after feature exploration. Creates a markdown document with progress tracking, critical decisions, and modular steps ready for execution."
---

# Plan Creation Stage

Based on our full exchange (typically after `/explore`), produce a markdown plan document.

## Requirements for the Plan

**Structure:**
- Include clear, minimal, concise steps
- Track status of each step using emojis:
  - 🟩 Done
  - 🟨 In Progress
  - 🟥 To Do
- Include dynamic tracking of overall progress percentage (at top)
- Steps should be modular, elegant, minimal
- Steps should integrate seamlessly within the existing codebase

**Constraints:**
- **DO NOT add extra scope** or unnecessary complexity beyond explicitly clarified details
- **DO NOT invent requirements** not discussed during exploration
- **DO NOT over-engineer** - stick to what was agreed upon
- **DO NOT add "nice-to-haves"** unless explicitly requested

## Markdown Template

```markdown
# Feature Implementation Plan: [Feature Name]

**Overall Progress:** `0%` (0/X tasks complete)

---

## TL;DR
[1-2 sentence summary of what we're building and why]

---

## Critical Decisions
Key architectural/implementation choices made during exploration:
- **Decision 1**: [choice] - [brief rationale]
- **Decision 2**: [choice] - [brief rationale]
- **Decision 3**: [choice] - [brief rationale]

---

## Implementation Tasks

### Phase 1: [Phase Name]

- [ ] 🟥 **Task 1.1: [Clear Task Name]**
  - [ ] 🟥 Subtask 1: [Specific action]
  - [ ] 🟥 Subtask 2: [Specific action]
  - **Files**: `path/to/file.ts`, `path/to/other.py`
  - **Notes**: [Any important context or warnings]

- [ ] 🟥 **Task 1.2: [Clear Task Name]**
  - [ ] 🟥 Subtask 1: [Specific action]
  - [ ] 🟥 Subtask 2: [Specific action]
  - **Files**: `path/to/file.tsx`
  - **Notes**: [Context]

### Phase 2: [Phase Name]

- [ ] 🟥 **Task 2.1: [Clear Task Name]**
  - [ ] 🟥 Subtask 1: [Specific action]
  - **Files**: `path/to/component.tsx`
  - **Dependencies**: Task 1.1 must complete first

- [ ] 🟥 **Task 2.2: [Clear Task Name]**
  - [ ] 🟥 Subtask 1: [Specific action]
  - [ ] 🟥 Subtask 2: [Specific action]
  - **Files**: `path/to/api.ts`

### Phase 3: [Phase Name - Testing & Polish]

- [ ] 🟥 **Task 3.1: Testing**
  - [ ] 🟥 Test [scenario 1]
  - [ ] 🟥 Test [scenario 2]
  - [ ] 🟥 Test edge cases identified in exploration

- [ ] 🟥 **Task 3.2: Documentation**
  - [ ] 🟥 Update relevant README/docs
  - [ ] 🟥 Add code comments for complex logic

---

## Rollback Plan

**If things go wrong:**
1. [Revert step 1]
2. [Revert step 2]
3. [How to restore previous state]

---

## Success Criteria

✅ [Criterion 1 - specific, measurable]
✅ [Criterion 2 - specific, measurable]
✅ [Criterion 3 - specific, measurable]

---

## Out of Scope (For This Plan)

- [Feature/enhancement explicitly not included]
- [Future improvement mentioned but deferred]
- [Alternative approach considered but rejected]
```

## Plan Creation Workflow

### Step 1: Synthesize Exploration Results
- Review all questions and answers from `/explore`
- Confirm critical decisions made
- Identify all files that will be modified
- Map dependencies between tasks

### Step 2: Break Into Phases
Organize tasks into logical phases:
- **Phase 1**: Usually database/backend changes
- **Phase 2**: Usually API/business logic
- **Phase 3**: Usually frontend/UI
- **Phase 4**: Usually testing and documentation

Phases should:
- Build on each other sequentially
- Be independently testable
- Have clear deliverables

### Step 3: Define Tasks and Subtasks
Each task should:
- Have a clear, action-oriented name
- List specific files to modify
- Include any important notes or warnings
- Note dependencies on other tasks
- Be completable in <2 hours

Each subtask should:
- Be a single, concrete action
- Be verifiable when complete
- Use active voice ("Add function X", "Update query Y")

### Step 4: Establish Success Criteria
Define what "done" means:
- Specific, measurable outcomes
- Observable behavior changes
- Performance requirements met
- Tests passing

### Step 5: Document Rollback Plan
If implementation fails:
- How to revert database changes
- How to restore previous code state
- What to communicate to users (if applicable)

### Step 6: Mark Out of Scope
Explicitly document what's NOT included:
- Future enhancements discussed but deferred
- Alternative approaches considered but rejected
- Related features that are separate work

## Key Principles

1. **Minimal Viable Change**: Smallest change that delivers value
2. **No Scope Creep**: Only what was explicitly agreed upon
3. **Modular Steps**: Each task independently valuable
4. **Clear Dependencies**: Tasks ordered to avoid blocking
5. **Actionable**: Anyone should be able to execute the plan
6. **Testable Phases**: Each phase has verification steps
7. **Reversible**: Always document how to undo changes

## Example Plan

```markdown
# Feature Implementation Plan: Dark Mode Toggle

**Overall Progress:** `0%` (0/8 tasks complete)

---

## TL;DR
Add a dark mode toggle to the navbar that persists user preference in localStorage and applies dark Tailwind variants across all pages.

---

## Critical Decisions
- **State Management**: Using React Context (simple, no Zustand needed for single boolean)
- **Storage**: localStorage (user preference, not profile data)
- **Scope**: All existing pages get dark mode support now (incremental ruled out)
- **Default**: Light mode for new users, respects OS preference on first visit
- **UI**: Toggle in navbar dropdown next to user menu

---

## Implementation Tasks

### Phase 1: Theme Infrastructure

- [ ] 🟥 **Task 1.1: Create Theme Context**
  - [ ] 🟥 Create `ThemeContext.tsx` with theme state and toggle function
  - [ ] 🟥 Add localStorage read/write on mount/change
  - [ ] 🟥 Detect and respect OS dark mode preference on first visit
  - **Files**: `web-app/contexts/ThemeContext.tsx` (new)
  - **Notes**: Use `window.matchMedia('(prefers-color-scheme: dark)')` for OS detection

- [ ] 🟥 **Task 1.2: Wrap App in Theme Provider**
  - [ ] 🟥 Import ThemeContext in root layout
  - [ ] 🟥 Wrap children with ThemeProvider
  - [ ] 🟥 Apply `dark` class to `<html>` tag conditionally
  - **Files**: `web-app/app/layout.tsx`
  - **Dependencies**: Task 1.1 must complete first

### Phase 2: UI Components

- [ ] 🟥 **Task 2.1: Add Dark Mode Toggle to Navbar**
  - [ ] 🟥 Create toggle icon component (sun/moon icons)
  - [ ] 🟥 Add toggle button to navbar dropdown
  - [ ] 🟥 Wire up to theme context toggle function
  - **Files**: `web-app/components/Navbar.tsx`
  - **Dependencies**: Task 1.2 must complete first

- [ ] 🟥 **Task 2.2: Apply Dark Mode Styles**
  - [ ] 🟥 Add `dark:` variants to all pages (bg, text colors)
  - [ ] 🟥 Add `dark:` variants to all components (cards, buttons, inputs)
  - [ ] 🟥 Test contrast ratios for accessibility
  - **Files**: All `.tsx` files in `web-app/app/` and `web-app/components/`
  - **Notes**: Focus on text readability and contrast

### Phase 3: Testing & Polish

- [ ] 🟥 **Task 3.1: Manual Testing**
  - [ ] 🟥 Test toggle works and persists across page reloads
  - [ ] 🟥 Test OS dark mode preference detection on first visit
  - [ ] 🟥 Test all pages render correctly in both modes
  - [ ] 🟥 Test smooth transition between modes

- [ ] 🟥 **Task 3.2: Documentation**
  - [ ] 🟥 Add comment explaining ThemeContext usage
  - [ ] 🟥 Update README with dark mode feature
  - [ ] 🟥 Note localStorage key used (`theme-preference`)

---

## Rollback Plan

**If things go wrong:**
1. Remove `ThemeContext.tsx`
2. Revert `layout.tsx` to remove ThemeProvider wrapper
3. Revert `Navbar.tsx` to remove toggle button
4. Remove all `dark:` variant classes (git checkout previous commit)

---

## Success Criteria

✅ Dark mode toggle appears in navbar and is clickable
✅ Theme preference persists across page reloads
✅ All text remains readable in both light and dark modes
✅ OS dark mode preference is detected and applied on first visit
✅ Transition between modes is smooth (no flashing)

---

## Out of Scope (For This Plan)

- High contrast mode (future enhancement)
- Per-component theme customization
- Scheduled theme switching (e.g., dark at night)
- Syncing theme preference across devices (requires backend)
```

## Anti-Patterns (Don't Do This)

❌ Adding tasks not discussed during exploration
❌ Including "nice-to-have" features not explicitly requested
❌ Making tasks too large (>2 hours of work)
❌ Forgetting to mark file paths for each task
❌ Skipping the rollback plan
❌ Vague success criteria ("works well", "looks good")
❌ Over-engineering with unnecessary abstraction layers
❌ Assuming requirements beyond what was clarified

## Success Criteria for the Plan Itself

✅ Every task is actionable (no vague steps)
✅ All files to modify are listed
✅ Dependencies between tasks are clear
✅ Success criteria are specific and measurable
✅ Rollback plan exists and is realistic
✅ Out-of-scope items are explicitly documented
✅ Plan can be executed by someone else without clarification
✅ No scope creep beyond exploration agreement

## Plan Maintenance

**As implementation progresses:**
- Update emoji status: 🟥 → 🟨 → 🟩
- Update overall progress percentage
- Add notes for any deviations from plan
- Document issues encountered and solutions
- Mark completed checkboxes

**Example progress update:**
```markdown
**Overall Progress:** `37.5%` (3/8 tasks complete)

### Phase 1: Theme Infrastructure

- [x] 🟩 **Task 1.1: Create Theme Context**
  - [x] 🟩 Create `ThemeContext.tsx` with theme state and toggle function
  - [x] 🟩 Add localStorage read/write on mount/change
  - [x] 🟩 Detect and respect OS dark mode preference on first visit
  - **Completed**: 2026-01-19
  - **Notes**: Added debounce to localStorage writes for performance

- [x] 🟩 **Task 1.2: Wrap App in Theme Provider**
  - [x] 🟩 Import ThemeContext in root layout
  - [x] 🟩 Wrap children with ThemeProvider
  - [x] 🟩 Apply `dark` class to `<html>` tag conditionally
  - **Completed**: 2026-01-19

- [ ] 🟨 **Task 2.1: Add Dark Mode Toggle to Navbar**
  - [x] 🟩 Create toggle icon component (sun/moon icons)
  - [ ] 🟨 Add toggle button to navbar dropdown (IN PROGRESS)
  - [ ] 🟥 Wire up to theme context toggle function
  - **Notes**: Using lucide-react icons for sun/moon
```

## Integration with Other Skills

**Complete Workflow:**
1. User describes feature
2. **`/explore`** - Deep analysis, surface ambiguities
3. User answers all clarification questions
4. **`/create-plan`** - Generate implementation plan (THIS SKILL)
5. **Chief-of-Staff CTO Mode** - Break plan into agent-delegated phases
6. **Specialist agents** - Execute plan phases
7. **`/create-issue`** - Capture any new bugs/improvements discovered during implementation

**When to use this skill:**
- After `/explore` is complete and all questions answered
- Before handing off to chief-of-staff for execution
- When you need a living document to track progress
- When multiple people will work on the feature

**When NOT to use this skill:**
- For trivial changes (just implement directly)
- Before exploration is complete
- When user wants to jump straight to code
- For emergency bug fixes (use `/create-issue` instead)

## File Location

Plans should be saved to: `.plans/[feature-name]-implementation-plan.md`

Example:
```bash
.plans/
├── dark-mode-implementation-plan.md
├── user-auth-implementation-plan.md
└── search-optimization-implementation-plan.md
```

Create the `.plans/` directory if it doesn't exist:
```bash
mkdir -p .plans
```