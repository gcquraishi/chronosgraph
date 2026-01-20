---
name: review
description: "Comprehensive code review checking logging, error handling, TypeScript quality, production readiness, React patterns, performance, security, and architecture. Outputs prioritized findings with fix suggestions."
---

# Code Review Task

Perform comprehensive code review. Be thorough but concise.

## Review Checklist

### 1. Logging
- ❌ No `console.log` statements in production code
- ✅ Uses proper logger with context (e.g., `logger.info`, `logger.error`)
- ✅ Log messages include relevant context (user ID, request ID, etc.)
- ✅ No sensitive data in logs (passwords, tokens, PII)

### 2. Error Handling
- ✅ Try-catch blocks for all async operations
- ✅ Errors propagated or handled appropriately
- ✅ Centralized error handlers used (not scattered catches)
- ✅ Helpful error messages for debugging
- ✅ User-facing errors are friendly, not technical stack traces
- ❌ No swallowed errors (empty catch blocks)

### 3. TypeScript Quality
- ❌ No `any` types (use proper types or `unknown`)
- ✅ Interfaces defined for complex objects
- ✅ Return types explicit on functions
- ❌ No `@ts-ignore` or `@ts-expect-error` without comments
- ✅ Proper null/undefined handling
- ✅ Enums or union types for constants

### 4. Production Readiness
- ❌ No debug statements (`console.log`, `debugger`)
- ❌ No TODO/FIXME comments without tickets
- ❌ No hardcoded secrets, API keys, or passwords
- ✅ Environment variables used for config
- ✅ Feature flags checked before release
- ❌ No commented-out code blocks

### 5. React/Hooks Patterns
- ✅ useEffect hooks have cleanup functions where needed
- ✅ Dependency arrays are complete and correct
- ❌ No infinite loop risks (missing deps, state in dep array)
- ✅ Custom hooks follow naming convention (`use*`)
- ✅ Components properly memoized if expensive
- ❌ No unnecessary renders (key prop misuse, inline functions)

### 6. Performance
- ✅ Expensive calculations memoized (`useMemo`, `useCallback`)
- ✅ Database queries limited (LIMIT clauses)
- ✅ Pagination implemented for large lists
- ❌ No N+1 query problems
- ✅ Images optimized and lazy-loaded
- ✅ Bundle size considerations (tree-shaking, code splitting)

### 7. Security
- ✅ Authentication checked on protected routes/APIs
- ✅ Authorization verified (user has permission)
- ✅ Input validation on all user data
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (sanitized outputs)
- ✅ CSRF protection where needed
- ✅ RLS (Row Level Security) policies in place for DB
- ❌ No secrets in client-side code

### 8. Architecture & Patterns
- ✅ Code follows existing project patterns
- ✅ Files in correct directory structure
- ✅ Proper separation of concerns (data/logic/UI)
- ✅ DRY principle (no unnecessary duplication)
- ✅ Functions are single-purpose and well-named
- ✅ Consistent naming conventions
- ❌ No god objects or massive files (>500 lines warning)

## Review Process

### Step 1: Identify Scope
Ask user:
- "Which files should I review?"
- Or: "Review the files modified in the last commit?"
- Or: "Review all files in a specific directory?"

### Step 2: Read and Analyze
For each file:
1. Read the entire file
2. Check against all 8 review categories
3. Note line numbers for issues
4. Assess severity (Critical, High, Medium, Low)
5. Suggest specific fixes

### Step 3: Categorize Findings
Organize issues by:
1. **Critical** - Must fix before merge
2. **High** - Should fix before merge
3. **Medium** - Fix in near future
4. **Low** - Nice to have

### Step 4: Output Report
Use the template below

## Output Format

```markdown
# Code Review Report

**Files Reviewed:** [count] files, [total lines] lines

---

## ✅ Looks Good

- Error handling comprehensive with try-catch blocks
- TypeScript types properly defined, no `any` usage
- Authentication checks on all protected routes
- Database queries include LIMIT clauses
- React hooks follow best practices

---

## ⚠️ Issues Found

### CRITICAL Issues (Must Fix)

- **CRITICAL** `web-app/api/users/route.ts:45` - SQL injection vulnerability
  - **Issue**: User input concatenated directly into query string
  - **Fix**: Use parameterized query: `db.query('SELECT * FROM users WHERE id = $1', [userId])`
  - **Impact**: Attackers can execute arbitrary SQL

- **CRITICAL** `web-app/lib/auth.ts:23` - Hardcoded API key in source
  - **Issue**: API key `sk_live_abc123` committed to repository
  - **Fix**: Move to environment variable: `process.env.API_KEY`
  - **Impact**: API key exposed publicly

### HIGH Priority Issues (Should Fix)

- **HIGH** `web-app/components/UserList.tsx:67` - Infinite loop risk
  - **Issue**: `useEffect` missing dependency: `userId` used but not in array
  - **Fix**: Add `userId` to dependency array: `useEffect(() => {...}, [userId])`
  - **Impact**: Component may render with stale data

- **HIGH** `web-app/api/media/create/route.ts:89` - No input validation
  - **Issue**: User input accepted without validation before DB write
  - **Fix**: Add validation: `if (!title || title.length > 255) throw new Error(...)`
  - **Impact**: Invalid data can corrupt database

### MEDIUM Priority Issues (Fix Soon)

- **MEDIUM** `web-app/components/Graph.tsx:234` - Console.log in production
  - **Issue**: Debug logging left in code: `console.log('Rendering graph')`
  - **Fix**: Remove or replace with proper logger
  - **Impact**: Clutters browser console, minor performance hit

- **MEDIUM** `web-app/lib/db.ts:156` - TypeScript `any` type
  - **Issue**: Function parameter typed as `any`: `function process(data: any)`
  - **Fix**: Define proper interface: `interface MediaData { ... }`
  - **Impact**: Loses type safety, potential runtime errors

- **MEDIUM** `web-app/components/Search.tsx:45` - Unnecessary re-renders
  - **Issue**: Inline function passed as prop: `onClick={() => handleClick()}`
  - **Fix**: Use `useCallback`: `const memoizedHandler = useCallback(handleClick, [])`
  - **Impact**: Child components re-render unnecessarily

### LOW Priority Issues (Nice to Have)

- **LOW** `web-app/utils/format.ts:12` - TODO comment without ticket
  - **Issue**: `// TODO: Handle edge case for null values`
  - **Fix**: Create ticket and reference: `// TODO(#123): Handle null values`
  - **Impact**: Tech debt might be forgotten

- **LOW** `web-app/components/Header.tsx:89` - Magic number
  - **Issue**: Hardcoded value: `if (width > 768)`
  - **Fix**: Use named constant: `const MOBILE_BREAKPOINT = 768`
  - **Impact**: Reduces maintainability

---

## 📊 Summary

- **Files reviewed**: 8 files, 1,234 lines
- **CRITICAL issues**: 2 (SQL injection, hardcoded secret)
- **HIGH issues**: 2 (infinite loop, no validation)
- **MEDIUM issues**: 3 (logging, any types, re-renders)
- **LOW issues**: 2 (TODOs, magic numbers)

**Total issues**: 9

**Recommendation**: ❌ **DO NOT MERGE** - Fix 2 critical and 2 high priority issues first

---

## 🎯 Priority Actions

1. **Immediate** (before merge):
   - Fix SQL injection in `api/users/route.ts:45`
   - Remove hardcoded API key from `lib/auth.ts:23`
   - Fix infinite loop risk in `UserList.tsx:67`
   - Add input validation in `api/media/create/route.ts:89`

2. **Short-term** (this sprint):
   - Remove console.log statements
   - Replace `any` types with proper interfaces
   - Optimize re-render issues

3. **Long-term** (backlog):
   - Address TODOs with tickets
   - Extract magic numbers to constants

---

## 📚 Recommendations

**General observations:**
- Strong TypeScript usage overall, but a few `any` types slipped through
- Error handling is good, but some async operations lack try-catch
- Performance is solid, minor optimization opportunities exist

**Suggested improvements:**
1. Add ESLint rule to ban `console.log` in production builds
2. Set up pre-commit hook to check for hardcoded secrets
3. Consider adding React DevTools Profiler for render optimization
4. Document error handling patterns in CONTRIBUTING.md

**Positive highlights:**
- ✅ Database queries properly use parameterized queries (except 1 case)
- ✅ React hooks dependencies mostly correct
- ✅ Good separation of concerns in component structure
- ✅ Consistent naming conventions throughout
```

## Severity Level Definitions

### CRITICAL
**Must fix before merge. Block deployment.**
- Security vulnerabilities (SQL injection, XSS, auth bypass)
- Data loss risks (missing validation, corrupted writes)
- Application crashes (uncaught exceptions, infinite loops)
- Hardcoded secrets (API keys, passwords, tokens)

### HIGH
**Should fix before merge. Negotiate if blocked.**
- Bugs that affect core functionality
- Performance issues (N+1 queries, memory leaks)
- Bad UX (errors without messages, broken flows)
- Missing input validation on critical paths
- Infinite loop risks in React hooks

### MEDIUM
**Fix in near future (this sprint).**
- Code quality issues (any types, poor naming)
- Maintainability concerns (large functions, duplication)
- Minor performance optimizations
- Missing tests for new code
- Console.log statements in production

### LOW
**Nice to have. Can defer to backlog.**
- Style inconsistencies (formatting, spacing)
- Minor improvements (magic numbers, TODO comments)
- Documentation gaps (missing JSDoc, README updates)
- Optimization opportunities (micro-optimizations)

## Context-Specific Checks

### For ChronosGraph Project

**Neo4j Queries:**
- ✅ Use parameterized queries (`MATCH (n {id: $id})`)
- ✅ Include LIMIT clauses on collections
- ✅ Validate canonical_id and wikidata_id before writes
- ✅ Follow MediaWork Ingestion Protocol (5 steps)

**Next.js API Routes:**
- ✅ Export proper HTTP method handlers (GET, POST, etc.)
- ✅ Return NextResponse with proper status codes
- ✅ Handle errors with try-catch
- ✅ Validate request body before processing

**React Components:**
- ✅ Use Tailwind classes (no inline styles)
- ✅ Follow existing component patterns
- ✅ Proper loading states for async data
- ✅ Error boundaries for critical UI sections

**TypeScript:**
- ✅ Import types from `web-app/lib/types.ts`
- ✅ Use existing interfaces (MediaWork, HistoricalFigure, GraphNode)
- ✅ Explicit return types on exported functions

## Review Modes

### Mode 1: Quick Review (5-10 min)
Scan for:
- Critical security issues
- Console.log statements
- Any types
- Missing error handling

**Use when:** Pre-commit check, pair programming

### Mode 2: Standard Review (15-30 min)
Check all 8 categories:
- Logging, errors, TypeScript, production readiness
- React patterns, performance, security, architecture

**Use when:** Pull request review, before merge

### Mode 3: Deep Review (45-60 min)
Standard review + additional checks:
- Test coverage analysis
- Performance profiling suggestions
- Accessibility audit
- SEO considerations
- Documentation completeness

**Use when:** Major feature launch, quarterly codebase audit

## Usage Examples

### Example 1: Review Last Commit
```
User: "/review"

Agent: "What would you like me to review?"

User: "Review the last commit"

Agent: [Runs git diff to find changed files]
       [Reviews 3 files: api/media/route.ts, components/MediaForm.tsx, lib/db.ts]
       [Outputs comprehensive report]
```

### Example 2: Review Specific Files
```
User: "/review web-app/api/media/create/route.ts web-app/components/MediaForm.tsx"

Agent: [Reviews specified files]
       [Outputs report]
```

### Example 3: Review Directory
```
User: "/review web-app/app/api/media/**"

Agent: [Finds all files in directory]
       [Reviews 5 files]
       [Outputs report]
```

## Integration with Workflow

**Position in development pipeline:**
```
/execute → /review → Fix issues → /review again → code-review-tester agent → Commit
```

**When to use `/review`:**
- After completing `/execute` implementation
- Before creating pull request
- After addressing feedback
- During pair programming for quick checks
- Before deploying to production

**Not needed when:**
- Trivial changes (typo fixes, formatting)
- Changes already reviewed by automated tools
- Emergency hotfixes (review after deployment)

## Automated Tool Integration

**Complement, don't replace automated tools:**
- ESLint: Catches style issues, this reviews logic
- TypeScript compiler: Catches type errors, this reviews architecture
- Prettier: Formats code, this reviews patterns
- Unit tests: Verify behavior, this reviews test coverage

**This review catches:**
- Logic errors tests might miss
- Architecture anti-patterns
- Security issues beyond linting
- Performance concerns
- Production readiness gaps

## Anti-Patterns (Don't Do This)

❌ Nitpicking style without automated formatter configured
❌ Marking console.log as CRITICAL (it's MEDIUM)
❌ Reviewing files not modified (waste of time)
❌ Giving vague feedback ("this looks bad")
❌ Suggesting rewrites without clear rationale
❌ Ignoring existing project patterns
❌ Being overly pedantic on naming

## Success Criteria

After review:

✅ All critical and high issues identified with line numbers
✅ Specific fix suggestions provided for each issue
✅ Severity accurately assessed
✅ Report is actionable (clear what to fix first)
✅ Positive aspects acknowledged (not just criticism)
✅ Recommendations help prevent future issues
✅ Review completed in reasonable time (<30 min for standard mode)