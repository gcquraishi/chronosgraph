---
name: peer-review
description: "Critically evaluate peer review feedback from external reviewers (other AI models, contractors, consultants). Verify each finding exists, assess validity, and create action plans only for confirmed issues."
---

# Peer Review Evaluation

A different team lead within the company has reviewed the current code/implementation and provided findings below.

## Important Context

**You are the team lead. They have less context than you.**

- **They have less context** on this project's history, architecture decisions, and existing patterns
- **You are the team lead** - don't accept findings at face value
- Your job is to **critically evaluate** each finding with the full project context you possess
- Some findings may be based on misunderstandings or incomplete information
- Your responsibility: separate signal from noise

## Evaluation Process

### For EACH finding provided:

**Step 1: Verify It Exists**
- Read the actual code at the specified location
- Check if the issue described actually exists
- Look for evidence that contradicts the finding
- Consider if the reviewer might have misunderstood the architecture

**Step 2: Assess Context**
- Does the project have architectural reasons for this pattern?
- Is there historical context the reviewer lacks?
- Are there constraints or requirements they don't know about?
- Is this pattern consistent with existing codebase conventions?

**Step 3: Determine Validity**

**If finding is INVALID:**
- Explain clearly why it doesn't apply
- Provide evidence from the code
- Explain what the reviewer misunderstood
- Reference architectural decisions or project context

**If finding is VALID:**
- Confirm the issue exists
- Assess actual severity (may differ from reviewer's assessment)
- Add to prioritized fix plan
- Note any caveats or context

## Input Format

User will provide peer review findings:

```
Findings from peer review:

1. [File:line] - [Issue description]
   - Severity: [reviewer's assessment]
   - Suggested fix: [their suggestion]

2. [File:line] - [Issue description]
   ...
```

## Output Format

```markdown
# Peer Review Evaluation Report

**Reviewer**: [External team lead / Model name]
**Total Findings**: X
**Valid Findings**: Y
**Invalid Findings**: Z

---

## 📋 Finding-by-Finding Analysis

### Finding 1: [Issue Summary]
**Location**: `file.ts:123`
**Reviewer's Severity**: HIGH
**Reviewer's Claim**: [What they said]

**Verification**: ✅ CONFIRMED / ❌ INVALID / ⚠️ PARTIALLY VALID

**Analysis**:
[Detailed explanation of why this is valid/invalid]

**Evidence**:
```typescript
// Actual code from file.ts:123
[relevant code snippet]
```

**Decision**:
- **If INVALID**: [Explain misunderstanding]
- **If VALID**: Add to fix plan with severity [CRITICAL/HIGH/MEDIUM/LOW]

---

### Finding 2: [Issue Summary]
[... repeat for each finding ...]

---

## ✅ Valid Findings (Confirmed Issues)

### CRITICAL Priority
1. **[Issue]** - `file.ts:line`
   - **Confirmed**: [Why it's a real issue]
   - **Actual Severity**: CRITICAL (originally: HIGH)
   - **Fix**: [Specific fix plan]

### HIGH Priority
2. **[Issue]** - `file.ts:line`
   - **Confirmed**: [Why it's a real issue]
   - **Actual Severity**: HIGH
   - **Fix**: [Specific fix plan]

### MEDIUM/LOW Priority
[... additional confirmed issues ...]

---

## ❌ Invalid Findings (Dismissed)

### Finding: [Issue that doesn't exist]
**Why Invalid**:
- Code already handles this case (see line X)
- Reviewer misunderstood the architecture
- This pattern is intentional due to [constraint/requirement]

**Evidence**:
```typescript
// Code showing the issue is already handled
[snippet]
```

---

### Finding: [Another invalid issue]
**Why Invalid**:
- This is a project-specific pattern documented in CLAUDE.md
- Reviewer assumed standard pattern, but we use [alternative] for [reason]
- Historical decision made in [context]

---

## 📊 Summary

**Findings Breakdown:**
- Total findings: X
- Valid findings: Y (Z%)
- Invalid findings: A (B%)
- Partially valid: C

**Severity Distribution (Valid Only):**
- CRITICAL: X
- HIGH: Y
- MEDIUM: Z
- LOW: A

**Overall Assessment**:
[1-2 sentence summary of the review quality and your confidence in the findings]

**Reviewer Blind Spots**:
- [Pattern/context they consistently missed]
- [Architectural decision they weren't aware of]

---

## 🎯 Prioritized Action Plan

### Immediate (Fix Before Merge)
1. [CRITICAL issue from valid findings]
2. [HIGH issue from valid findings]

### Short-Term (This Sprint)
1. [MEDIUM issues]

### Long-Term (Backlog)
1. [LOW issues]

### Not Planned (Invalid Findings)
- [List of dismissed findings that won't be actioned]

---

## 📚 Recommendations

**For the external reviewer:**
- [Suggest context/docs they should review before next review]
- [Clarify architectural decisions that caused confusion]

**For the codebase:**
- [Consider if documentation should be improved to prevent future misunderstandings]
- [Are there patterns that should be documented in CONTRIBUTING.md?]

**For the team:**
- [Process improvements based on this review]
```

## Evaluation Criteria

### How to Assess "Invalid" Findings

**Common reasons findings are invalid:**

1. **Already Handled**
   - Code already has error handling, but reviewer missed it
   - Edge case is handled elsewhere in the flow
   - Validation exists in a different layer

2. **Architectural Misunderstanding**
   - Reviewer assumed standard pattern, project uses different approach
   - Pattern is intentional due to specific constraints
   - Historical decision made for valid reasons

3. **Context Gaps**
   - Reviewer lacks knowledge of project requirements
   - Missing awareness of external system constraints
   - Doesn't understand business logic necessitating the approach

4. **Over-Engineering Suggestion**
   - Reviewer suggests complex solution for simple problem
   - Proposed fix violates project's "minimal" principle
   - Suggestion doesn't match existing patterns

5. **Incorrect Severity Assessment**
   - Issue is real but reviewer over-estimated severity
   - Edge case is so rare it's not worth fixing
   - Performance concern doesn't apply at current scale

### How to Assess "Valid" Findings

**Criteria for confirming validity:**

1. **Issue Exists**
   - Code inspection confirms the problem
   - Behavior matches reviewer's description
   - Bug is reproducible

2. **Actually a Problem**
   - Issue has real impact (security, bugs, UX)
   - Not just a style preference
   - Violates documented best practices or requirements

3. **Not Already Planned**
   - Issue isn't already in backlog
   - Not scheduled for refactor in next sprint
   - Not documented as "known limitation"

4. **Worth Fixing**
   - Cost of fix < cost of leaving broken
   - Aligns with project priorities
   - Doesn't require massive refactor

## Example Evaluation

```markdown
# Peer Review Evaluation Report

**Reviewer**: GPT-4 Contractor Review
**Total Findings**: 5
**Valid Findings**: 2
**Invalid Findings**: 3

---

## 📋 Finding-by-Finding Analysis

### Finding 1: SQL Injection Vulnerability
**Location**: `web-app/api/media/create/route.ts:67`
**Reviewer's Severity**: CRITICAL
**Reviewer's Claim**: "User input concatenated directly into query string without sanitization"

**Verification**: ❌ INVALID

**Analysis**:
The reviewer claimed SQL injection risk, but this project uses Neo4j (graph database, not SQL) with parameterized queries via the Neo4j driver. The code in question is:

**Evidence**:
```typescript
// Line 67 in api/media/create/route.ts
const result = await session.run(
  'CREATE (m:MediaWork {title: $title, media_id: $mediaId})',
  { title: title, mediaId: mediaId }
);
```

This is a **parameterized query** using Neo4j's native parameter syntax (`$title`, `$mediaId`). The reviewer appears to have confused Neo4j's Cypher syntax with SQL string concatenation.

**Decision**: INVALID - No security risk. Reviewer misunderstood Neo4j query parameterization.

---

### Finding 2: Missing Input Validation
**Location**: `web-app/api/media/create/route.ts:45`
**Reviewer's Severity**: HIGH
**Reviewer's Claim**: "No validation on title length before database write"

**Verification**: ✅ CONFIRMED

**Analysis**:
Verified code at line 45:

**Evidence**:
```typescript
// Line 45 in api/media/create/route.ts
const { title, mediaType, releaseYear } = await request.json();

// Immediately uses title without length check
const mediaId = generateSlug(title);
```

The title field is indeed not validated before use. While Neo4j doesn't have strict column limits like SQL, excessively long titles could:
1. Break UI display
2. Cause issues with the slug generation
3. Lead to unexpected behavior in search

**Actual Severity**: MEDIUM (not HIGH - no data corruption risk, just UX issue)

**Decision**: VALID - Add validation: `if (title.length > 255 || title.length < 1)`

---

### Finding 3: React useEffect Missing Dependency
**Location**: `web-app/components/GraphExplorer.tsx:234`
**Reviewer's Severity**: HIGH
**Reviewer's Claim**: "useEffect depends on userId but it's not in dependency array"

**Verification**: ❌ INVALID

**Analysis**:
Checked the actual code:

**Evidence**:
```typescript
// Line 234 in GraphExplorer.tsx
useEffect(() => {
  if (canonicalId) {
    fetchGraphData(canonicalId);
  }
}, [canonicalId, fetchGraphData]); // userId is NOT used in this effect
```

The effect depends on `canonicalId`, not `userId`. The reviewer appears to have confused variable names or reviewed outdated code. The `userId` variable exists in the file but is used in a different effect on line 189 (which correctly includes it in dependencies).

**Decision**: INVALID - Reviewer referenced wrong effect or outdated code.

---

### Finding 4: No Loading State for Async Operation
**Location**: `web-app/components/MediaForm.tsx:89`
**Reviewer's Severity**: MEDIUM
**Reviewer's Claim**: "Form submission has no loading state, users can double-click submit"

**Verification**: ✅ CONFIRMED

**Analysis**:
Checked the submit handler:

**Evidence**:
```typescript
// Line 89 in MediaForm.tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const response = await fetch('/api/media/create', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
  // No loading state, button remains enabled
};
```

Confirmed: No `isLoading` state, button doesn't disable during submission, no loading spinner. Users could indeed double-click and create duplicate entries.

**Actual Severity**: HIGH (not MEDIUM - can cause duplicate data)

**Decision**: VALID - Add loading state and disable button during submission.

---

### Finding 5: Console.log in Production Code
**Location**: `web-app/lib/db.ts:456`
**Reviewer's Severity**: MEDIUM
**Reviewer's Claim**: "Debug console.log statement left in production code"

**Verification**: ⚠️ PARTIALLY VALID

**Analysis**:
Checked the code:

**Evidence**:
```typescript
// Line 456 in lib/db.ts
console.error('Failed to connect to Neo4j:', error);
throw new Error('Database connection failed');
```

This is `console.error()`, not `console.log()`. The reviewer is technically correct that it's a console statement, but:
1. `console.error()` is acceptable for critical errors in Node.js backends
2. This is server-side code (Next.js API route helper), not client-side
3. Error logging to console is standard practice for backend services

However, the project could benefit from a proper structured logger (e.g., Winston, Pino) for production.

**Actual Severity**: LOW (not MEDIUM - functional but not ideal)

**Decision**: PARTIALLY VALID - Consider upgrading to structured logger, but not urgent.

---

## ✅ Valid Findings (Confirmed Issues)

### HIGH Priority
1. **Missing loading state in MediaForm** - `MediaForm.tsx:89`
   - **Confirmed**: Button stays enabled during async submit, allows double-clicks
   - **Actual Severity**: HIGH (can create duplicate data)
   - **Fix**: Add `isLoading` state, disable button, show spinner

### MEDIUM Priority
2. **Missing input validation on title** - `api/media/create/route.ts:45`
   - **Confirmed**: Title length not validated before use
   - **Actual Severity**: MEDIUM (UX issue, not critical)
   - **Fix**: Add validation: `if (!title || title.length > 255)`

### LOW Priority
3. **Console statements instead of structured logging** - `db.ts:456`
   - **Confirmed**: Using console.error instead of proper logger
   - **Actual Severity**: LOW (functional but not ideal)
   - **Fix**: Consider Winston or Pino for structured logging

---

## ❌ Invalid Findings (Dismissed)

### Finding: SQL Injection Vulnerability
**Why Invalid**:
- Project uses Neo4j (not SQL)
- Code uses parameterized queries correctly
- Reviewer confused Cypher parameter syntax (`$param`) with SQL string concatenation

**Evidence**:
```typescript
session.run('CREATE (m:MediaWork {title: $title})', { title: title })
// ^ Parameterized, safe
```

---

### Finding: useEffect Missing userId Dependency
**Why Invalid**:
- The effect in question (line 234) doesn't use `userId`
- `userId` is used in a different effect (line 189) which correctly includes it
- Reviewer appears to have reviewed wrong code section or outdated version

---

## 📊 Summary

**Findings Breakdown:**
- Total findings: 5
- Valid findings: 2 fully valid, 1 partially valid (60%)
- Invalid findings: 2 (40%)

**Severity Distribution (Valid Only):**
- HIGH: 1 (loading state)
- MEDIUM: 1 (validation)
- LOW: 1 (logging)

**Overall Assessment**:
Mixed quality review. The reviewer caught some real issues (loading state, validation) but also made critical errors due to lack of project context (confused Neo4j with SQL, reviewed wrong code sections). Suggests they may have rushed or lacked familiarity with the stack.

**Reviewer Blind Spots**:
- Unfamiliar with Neo4j/Cypher (thought it was SQL)
- Didn't review full context of React hooks
- Over-estimated severity of console logging

---

## 🎯 Prioritized Action Plan

### Immediate (Fix Before Merge)
1. Add loading state to MediaForm submit button
   - Files: `web-app/components/MediaForm.tsx:89`
   - Impact: Prevents duplicate data from double-clicks

### Short-Term (This Sprint)
1. Add title length validation to media create API
   - Files: `web-app/api/media/create/route.ts:45`
   - Impact: Improves data quality, prevents UI breaks

### Long-Term (Backlog)
1. Upgrade to structured logging (Winston/Pino)
   - Files: Multiple across `web-app/lib/`
   - Impact: Better production debugging

### Not Planned (Invalid Findings)
- SQL injection fix (doesn't apply - we use Neo4j)
- useEffect dependency fix (doesn't exist - correct as-is)

---

## 📚 Recommendations

**For the external reviewer:**
- Review `CLAUDE.md` to understand Neo4j database usage
- Familiarize with project architecture before next review
- Double-check line numbers and code context

**For the codebase:**
- Consider adding comments explaining Neo4j parameterization for external reviewers
- Document why console.error is acceptable in backend code

**For the team:**
- Provide reviewers with architectural overview before reviews
- Set up review checklist specific to ChronosGraph stack
```

## Key Principles

### 1. Trust But Verify
- External reviewers may be skilled but lack project context
- Always verify findings against actual code
- Your deep project knowledge is an asset, not a bias

### 2. Context Matters
- Architectural decisions have reasons
- Historical constraints explain current patterns
- Project-specific requirements trump general best practices

### 3. Separate Signal from Noise
- Some findings will be gold
- Some will be based on misunderstandings
- Your job: filter effectively

### 4. Respectful but Firm
- Acknowledge reviewer's effort
- Be clear when dismissing findings
- Provide evidence, not opinions

### 5. Re-Assess Severity
- Reviewer's severity levels may be inaccurate
- Apply your project knowledge to re-evaluate
- Consider actual risk and impact in context

## When to Use This Skill

**Use `/peer-review` when:**
- External contractor/consultant has reviewed code
- Another AI model provided feedback
- Team member unfamiliar with project did review
- You received review from different department
- Third-party security audit findings arrived

**Don't use when:**
- Internal team review (use `/review` instead)
- User bug reports (use `/create-issue`)
- Self-review needed (use `/review`)
- Automated tool output (ESLint, TypeScript errors)

## Anti-Patterns

❌ Accepting all findings without verification
❌ Dismissing valid findings due to ego
❌ Being defensive about architectural choices
❌ Not providing evidence for dismissals
❌ Ignoring patterns in reviewer misunderstandings
❌ Failing to re-assess severity levels
❌ Not creating action plan for valid findings

## Success Criteria

After evaluation:

✅ Every finding verified against actual code
✅ Clear valid/invalid determination for each
✅ Evidence provided for all dismissals
✅ Severity re-assessed with project context
✅ Prioritized action plan for confirmed issues
✅ Respectful analysis acknowledging reviewer effort
✅ Recommendations to improve future reviews
✅ Identification of reviewer's blind spots