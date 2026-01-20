---
name: create-issue
description: "Quickly capture bugs, features, or improvements when you're mid-development. Creates a complete GitHub issue with title, description, context, and labels in under 2 minutes."
---

# Create Issue

User is mid-development and thought of a bug/feature/improvement. Capture it fast so they can keep working.

## Your Goal

Create a complete GitHub issue with:
- Clear title
- TL;DR of what this is about
- Current state vs expected outcome
- Relevant files that need touching
- Risk/notes if applicable
- Proper type/priority/effort labels

## How to Get There

**Ask questions** to fill gaps - be concise, respect the user's time. They're mid-flow and want to capture this quickly. Usually need:
- What's the issue/feature
- Current behavior vs desired behavior
- Type (bug/feature/improvement) and priority if not obvious

Keep questions brief. One message with 2-3 targeted questions beats multiple back-and-forths.

**Search for context** only when helpful:
- Web search for best practices if it's a complex feature
- Grep codebase to find relevant files
- Note any risks or dependencies you spot

**Skip what's obvious** - If it's a straightforward bug, don't search web. If type/priority is clear from description, don't ask.

**Keep it fast** - Total exchange under 2min. Be conversational but brief. Get what you need, create ticket, done.

## Behavior Rules

- Be conversational - ask what makes sense, not a checklist
- Default priority: normal, effort: medium (ask only if unclear)
- Max 3 files in context - most relevant only
- Bullet points over paragraphs

## Issue Format Template

When creating the issue, use `gh issue create` with this structure:

```
Title: [Clear, actionable title]

## Summary
[1-2 sentence TL;DR]

## Current Behavior
[What happens now]

## Expected Behavior
[What should happen]

## Relevant Files
- `path/to/file.ts` - [why it matters]
- `path/to/another.py` - [why it matters]

## Notes
[Any risks, dependencies, or context that helps]

Labels: [type: bug/feature/improvement], [priority: low/normal/high/critical], [effort: small/medium/large]
```

## Workflow

1. **Gather Info** (30-60s)
   - Ask 2-3 targeted questions if needed
   - Use Grep to find relevant files (optional)
   - Web search for complex features (optional)

2. **Create Issue** (15-30s)
   - Use `gh issue create --title "..." --body "..."`
   - Add labels with `--label` flags
   - Confirm issue number to user

3. **Done** (5s)
   - Return issue URL
   - Keep it brief: "Created #123 - [title]"

## Examples

### Example 1: Simple Bug
User: "The search bar crashes when you type special characters"

Response:
- Quick grep for search component
- Don't ask questions (obvious bug, high priority)
- Create issue immediately with crash details
- Label: bug, priority:high, effort:small

### Example 2: Feature Request
User: "We need dark mode"

Response:
- Ask: "Should it be a toggle or follow system preference? Persist in DB or localStorage?"
- Web search for Next.js dark mode patterns
- Grep for theme-related files
- Create issue with approach notes
- Label: feature, priority:normal, effort:medium

### Example 3: Mid-Flow Capture
User: "Just noticed the API returns 500 when creator field is missing"

Response:
- Grep for API route handling creator field
- Don't over-ask (context is clear)
- Note: "Likely needs null check in `/api/media/create/route.ts`"
- Create issue with validation fix suggestion
- Label: bug, priority:normal, effort:small

## Key Principles

1. **Respect Flow State**: User is coding. Don't derail them. 2min max.
2. **Smart Defaults**: Assume normal priority, medium effort unless obvious.
3. **Context Over Questions**: Search codebase first, ask second.
4. **Actionable Over Perfect**: Issue doesn't need to be perfect, needs to be captured.
5. **Use GitHub CLI**: Always use `gh issue create` - faster than web UI.

## Anti-Patterns (Don't Do This)

❌ Asking for information already obvious from description
❌ Web searching trivial bugs
❌ Listing more than 3 files
❌ Writing long paragraphs in issues
❌ Asking about priority for obvious critical bugs
❌ Multiple back-and-forths when one would suffice

## Success Criteria

- Issue created in under 2 minutes
- User can immediately return to coding
- Issue has enough context for future implementation
- No redundant questions asked
- Appropriate labels applied