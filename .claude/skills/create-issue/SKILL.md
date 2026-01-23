---
name: create-issue
description: "Quickly capture bugs, features, or improvements when you're mid-development. Creates a Linear ticket (CHR-XX) via GraphQL API with title, description, context, and priority in under 2 minutes."
---

# Create Issue

User is mid-development and thought of a bug/feature/improvement. Capture it fast in Linear so they can keep working.

---
**⚠️ CRITICAL: ALWAYS CREATE LINEAR TICKETS (CHR-XX), NEVER GITHUB ISSUES**
---

## Your Goal

Create a complete Linear ticket (NOT GitHub issue) with:
- Clear title
- TL;DR of what this is about
- Current state vs expected outcome
- Relevant files that need touching
- Risk/notes if applicable
- Priority level (1=critical, 2=high, 3=normal, 4=low)

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

**CRITICAL: ALL issues MUST be created in Linear using the GraphQL API. NEVER create GitHub issues.**

Issue description structure:
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

## Implementation Approach
[Implementation notes or suggestions]

## Labels
type:[bug/feature/improvement], priority:[low/normal/high/critical], effort:[small/medium/large]
```

## Workflow

1. **Gather Info** (30-60s)
   - Ask 2-3 targeted questions if needed
   - Use Grep to find relevant files (optional)
   - Web search for complex features (optional)

2. **Get Linear Team UUID** (5s)
   - Read `.env` file to get LINEAR_API_KEY
   - Query Linear GraphQL API to get team UUID:
     ```bash
     curl -X POST https://api.linear.app/graphql \
       -H "Authorization: $LINEAR_API_KEY" \
       -H "Content-Type: application/json" \
       --data-binary '{"query": "{ teams { nodes { id name key } } }"}'
     ```
   - Team key "CHR" maps to UUID (e.g., "37ed983e-84aa-4245-9894-443835075e7e")

3. **Create Linear Issue** (15-30s)
   - Use Linear GraphQL API mutation with curl
   - Use the team UUID (NOT the team key "CHR")
   - Parse JSON response to extract identifier and URL

4. **Done** (5s)
   - Return Linear issue URL with format: "Created CHR-17 - [title]"

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

## Linear API Integration

**IMPORTANT: Read credentials from `.env` file at project root.**

**Credentials:**
- API Key: Read `LINEAR_API_KEY` from `.env` file
- Team UUID: Fetch dynamically via GraphQL (team key "CHR" in `.env` is legacy)

**Priority Mapping:**
- `priority: low` → Priority 4
- `priority: normal` → Priority 3 (default)
- `priority: high` → Priority 2
- `priority: critical` → Priority 1 (URGENT)

**Complete curl Command Template:**
```bash
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: lin_api_XXXXXX" \
  -H "Content-Type: application/json" \
  --data-binary @- << 'EOF'
{
  "query": "mutation CreateIssue($input: IssueCreateInput!) { issueCreate(input: $input) { issue { id identifier title url } } }",
  "variables": {
    "input": {
      "teamId": "37ed983e-84aa-4245-9894-443835075e7e",
      "title": "Issue title here",
      "description": "## Summary\n...\n## Current Behavior\n...",
      "priority": 3
    }
  }
}
EOF
```

**Critical Notes:**
- `teamId` MUST be the UUID (e.g., "37ed983e-84aa-4245-9894-443835075e7e"), NOT "CHR"
- Fetch team UUID first with: `{ teams { nodes { id name key } } }`
- Use `--data-binary @-` with heredoc for proper JSON escaping
- Parse response JSON to extract `data.issueCreate.issue.identifier` and `url`

**Complete Example Workflow:**
```bash
# Step 1: Read API key from .env
LINEAR_API_KEY=$(grep LINEAR_API_KEY .env | cut -d= -f2)

# Step 2: Get team UUID
TEAM_UUID=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ teams { nodes { id key } } }"}' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Step 3: Create issue
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- << 'EOF'
{
  "query": "mutation CreateIssue($input: IssueCreateInput!) { issueCreate(input: $input) { issue { id identifier title url } } }",
  "variables": {
    "input": {
      "teamId": "37ed983e-84aa-4245-9894-443835075e7e",
      "title": "Fix search deduplication",
      "description": "## Summary\nDuplicate results showing...",
      "priority": 3
    }
  }
}
EOF
```

## Key Principles

1. **Linear-Only**: ALWAYS create issues in Linear via GraphQL API. NEVER use GitHub issues.
2. **Respect Flow State**: User is coding. Don't derail them. 2min max.
3. **Smart Defaults**: Assume normal priority, medium effort unless obvious.
4. **Context Over Questions**: Search codebase first, ask second.
5. **Actionable Over Perfect**: Issue doesn't need to be perfect, needs to be captured.
6. **Team UUID Required**: Always fetch team UUID from GraphQL, never use team key "CHR" directly.

## Anti-Patterns (Don't Do This)

❌ **Creating GitHub issues instead of Linear tickets**
❌ Using team key "CHR" as teamId (must use UUID)
❌ Asking for information already obvious from description
❌ Web searching trivial bugs
❌ Listing more than 3 files
❌ Writing long paragraphs in issues
❌ Asking about priority for obvious critical bugs
❌ Multiple back-and-forths when one would suffice

## Success Criteria

- **Linear ticket created** (CHR-XX format) in under 2 minutes
- User can immediately return to coding
- Issue has enough context for future implementation
- No redundant questions asked
- Appropriate priority applied (1-4)
- Valid Linear URL returned (linear.app/chronosgraph/issue/CHR-XX/...)