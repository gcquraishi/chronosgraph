---
name: explore
description: "Deep exploration and planning phase for features before implementation. Thoroughly analyzes codebase, identifies dependencies, edge cases, and surfaces all ambiguities to ensure clarity before coding begins."
---

# Initial Exploration Stage

Your task is NOT to implement this yet, but to fully understand and prepare.

## Your Responsibilities

**Analyze and understand the existing codebase thoroughly:**
- Map out current architecture patterns relevant to the feature
- Identify existing components, functions, or systems that will be affected
- Understand data flow and state management patterns
- Review similar existing features for consistency patterns

**Determine exactly how this feature integrates:**
- Dependencies: What existing code does this depend on?
- Structure: Where does this fit in the current architecture?
- Edge cases: What unusual scenarios need handling? (within reason, don't go overboard)
- Constraints: Technical limitations, performance considerations, data model restrictions

**Clearly identify anything unclear or ambiguous:**
- In the user's description
- In the current implementation
- In the expected behavior
- In the integration points

**List clearly all questions or ambiguities:**
- Requirements that need clarification
- Scope boundaries that are unclear
- Technical decisions that need input
- Trade-offs that require user preference

## Core Directive

**Remember, your job is NOT to implement (yet).**

You are exploring, planning, and asking questions to ensure all ambiguities are covered. We will go back and forth until you have no further questions.

**DO NOT assume any requirements or scope beyond explicitly described details.**

If something is unclear, ask. If multiple approaches are possible, present options. If edge cases exist, flag them. Your goal is perfect clarity before implementation begins.

## Workflow

### Phase 1: Acknowledge and Prepare
- Confirm you understand your exploration role
- Wait for the user to describe the feature in detail
- Do NOT start exploring until the feature is described

### Phase 2: Deep Exploration
Once the feature is described:

1. **Codebase Analysis** (10-15 minutes)
   - Grep for relevant files and patterns
   - Read key files that will be affected
   - Trace data flow from user action to database and back
   - Identify similar existing features

2. **Dependency Mapping** (5-10 minutes)
   - List files that will need modification
   - Identify functions/components that will be called
   - Note external dependencies (APIs, libraries, services)
   - Map database schema requirements

3. **Edge Case Identification** (5 minutes)
   - What happens with empty/null inputs?
   - What happens at scale (large datasets, many users)?
   - What happens with concurrent operations?
   - What happens when external services fail?
   - (Don't overdo this - focus on realistic scenarios)

4. **Integration Analysis** (5-10 minutes)
   - How does this fit with existing UI patterns?
   - Does this affect existing database queries?
   - Are there performance implications?
   - Does this require new API endpoints or modify existing ones?

### Phase 3: Question Formulation
Organize your questions into categories:

**Requirements Clarification:**
- What exactly should happen when [scenario]?
- Should this feature support [edge case]?
- What's the priority: performance vs features vs simplicity?

**Scope Boundaries:**
- Is [related functionality] in scope or out of scope?
- Should this work for [user type] or only [other user type]?
- How far should [feature aspect] extend?

**Technical Decisions:**
- Should we use [approach A] or [approach B]? (explain trade-offs)
- Where should this live: [location A] or [location B]?
- Should this be [real-time / batch / cached]?

**User Preferences:**
- Would you prefer [simple with limitations] or [complex but complete]?
- Should this match [existing pattern X] or [existing pattern Y]?

### Phase 4: Back-and-Forth Clarification
- Present your findings and questions clearly
- Use bullet points and concrete examples
- Wait for answers before proceeding
- Ask follow-up questions as needed
- Continue until you have **zero ambiguities**

### Phase 5: Ready for Implementation
Once all questions are answered:
- Summarize the complete, unambiguous feature specification
- List all files that will be modified
- Outline the implementation approach
- Confirm with user before proceeding to implementation

## Output Format

### After Initial Exploration
```
# Exploration Results for [Feature Name]

## Current Codebase Analysis
- **Relevant Files**: [list with line numbers]
- **Existing Patterns**: [how similar features work]
- **Data Flow**: [current state → action → new state]

## Dependencies
- **Code Dependencies**: [functions/components this will use]
- **External Dependencies**: [APIs, libraries, services]
- **Database Requirements**: [schema changes, new queries]

## Integration Points
- **UI**: [which components affected]
- **API**: [endpoints modified/created]
- **Database**: [queries modified/created]
- **State Management**: [how state flows]

## Edge Cases Identified
- [Edge case 1]: [how to handle?]
- [Edge case 2]: [how to handle?]
- [Edge case 3]: [how to handle?]

## Questions Needing Clarification

### Requirements
1. [Question about what should happen]
2. [Question about scope]

### Technical Decisions
1. [Approach A vs Approach B - trade-offs]
2. [Where should this live?]

### User Preferences
1. [Simple vs complete?]
2. [Match pattern X or Y?]

## Risks and Constraints
- [Performance consideration]
- [Technical limitation]
- [Breaking change warning]
```

## Key Principles

1. **Clarity Over Speed**: Take time to understand fully before moving forward
2. **Question Everything Ambiguous**: If it's not explicit, ask
3. **No Assumptions**: Never assume requirements not stated
4. **Show Your Work**: Explain what you found in the codebase
5. **Present Options**: When multiple approaches exist, lay out trade-offs
6. **Be Thorough, Not Exhaustive**: Cover realistic scenarios, not every edge case
7. **Wait for Green Light**: Don't implement until all questions answered

## Anti-Patterns (Don't Do This)

❌ Starting implementation before exploration is complete
❌ Assuming requirements not explicitly stated
❌ Skipping codebase analysis and guessing how it works
❌ Presenting only one approach when multiple exist
❌ Ignoring realistic edge cases
❌ Going overboard on edge cases (null in 50 places)
❌ Not reading existing similar features for patterns

## Success Criteria

✅ Every ambiguity surfaced and clarified
✅ All affected files identified with line numbers
✅ Integration approach clearly understood
✅ User confirms "yes, you understand correctly"
✅ No implementation started prematurely
✅ Questions organized and easy to answer
✅ Trade-offs clearly explained when options exist

## Example Interaction

```
User: "Add a dark mode toggle to the app"

Agent: "I understand you want dark mode. Let me explore the codebase first - give me a few minutes."

[Agent performs exploration]:
- Greps for theme/styling patterns
- Reads Tailwind config, existing CSS patterns
- Identifies state management approach
- Checks for any existing theme switching logic

Agent: "# Exploration Results for Dark Mode Toggle

## Current Codebase Analysis
- **Tailwind CSS**: Using Tailwind with default theme
- **No existing theme system**: No context or state for themes
- **Styling approach**: Tailwind utility classes throughout

## Integration Points
- **Global state needed**: Theme preference needs to persist
- **CSS changes**: Add dark: variants to existing components
- **Storage**: Need localStorage or DB for preference

## Questions for Clarification

### Requirements
1. Should this be a user preference (stored per-user) or device setting (localStorage)?
2. Apply to all pages or specific sections?
3. Should dark mode be default for first-time users, or light mode?

### Technical Decisions
1. **State management**: React Context or Zustand store?
2. **Scope**: Apply dark mode to all existing pages now, or incrementally?
3. **System preference**: Should we detect and follow OS dark mode preference?

### User Preferences
1. **UI for toggle**: Navbar dropdown? Settings page? Floating button?
2. **Transition**: Instant switch or smooth fade animation?
3. **Accessibility**: Should we support high-contrast mode too?

Let me know your preferences and I'll proceed with implementation."

User: [Answers questions]

Agent: "Perfect, that's crystal clear. Here's the implementation plan:
[...detailed plan with no ambiguities...]

Ready to implement?"
```

## Interaction with Chief-of-Staff CTO Mode

The `/explore` skill is **complementary** to the chief-of-staff's CTO workflow:

- **Use `/explore`**: When you want to deeply understand a feature before committing to an approach
- **Use CTO workflow**: When you're ready to break down and execute a well-understood feature

Typical flow:
1. User describes feature
2. `/explore` surfaces all ambiguities and integration points
3. User clarifies all questions
4. Hand off to chief-of-staff CTO mode for structured implementation
5. Chief-of-staff creates discovery prompts → phase breakdown → agent delegation