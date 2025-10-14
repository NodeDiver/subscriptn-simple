# Claude Code Configuration Details

## File Structure

```
.claude/
└── settings.local.json    # Local configuration (not committed to git)
```

## Configuration File: settings.local.json

### Purpose
Controls Claude Code's permissions and behavior in this project.

### Current Configuration

```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "Bash(node:*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

## Permission System

### Permission Levels

1. **allow**: Execute without asking
2. **ask**: Request confirmation before executing
3. **deny**: Block execution

### Permission Types

#### WebFetch Permissions
Control which domains Claude Code can fetch from.

**Syntax**: `WebFetch(domain:<domain>)`

**Examples**:
```json
"WebFetch(domain:github.com)"        // Allow GitHub
"WebFetch(domain:npmjs.com)"         // Allow npm registry
"WebFetch(domain:docs.anthropic.com)" // Allow Anthropic docs
```

#### Bash Permissions
Control which shell commands Claude Code can execute.

**Syntax**: `Bash(<command>:*)`

**Examples**:
```json
"Bash(node:*)"     // All Node.js commands
"Bash(npm:*)"      // All npm commands
"Bash(git:*)"      // All git commands
"Bash(docker:*)"   // All Docker commands
"Bash(prisma:*)"   // All Prisma commands
```

#### File Permissions
Control file access (if configured).

**Syntax**: `File(path:<pattern>)`

**Examples**:
```json
"File(path:src/**/*.ts)"      // TypeScript files in src
"File(path:docs/**/*.md)"     // Markdown files in docs
"File(path:.env.local)"       // Environment file (be careful!)
```

## Recommended Permissions for This Project

### Minimal Setup (Current)
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "Bash(node:*)"
    ],
    "deny": [],
    "ask": []
  }
}
```

### Standard Development Setup
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.com)",
      "Bash(node:*)",
      "Bash(npm:*)",
      "Bash(git:status)",
      "Bash(git:diff)",
      "Bash(git:log)"
    ],
    "deny": [
      "Bash(git:push)",
      "Bash(rm:-rf)"
    ],
    "ask": [
      "Bash(git:commit)",
      "Bash(git:add)"
    ]
  }
}
```

### Advanced Development Setup
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.com)",
      "WebFetch(domain:docs.anthropic.com)",
      "Bash(node:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(git:status)",
      "Bash(git:diff)",
      "Bash(git:log)",
      "Bash(prisma:*)",
      "Bash(docker:ps)",
      "Bash(docker:logs)"
    ],
    "deny": [
      "Bash(git:push)",
      "Bash(rm:-rf)",
      "Bash(docker:rm)"
    ],
    "ask": [
      "Bash(git:commit)",
      "Bash(git:add)",
      "Bash(docker:compose)"
    ]
  }
}
```

## Security Considerations

### Always Deny ❌
Never add these to `allow`:
- `Bash(rm:-rf)` - Recursive deletion
- `Bash(sudo:*)` - Elevated privileges
- `Bash(chmod:*)` - Permission changes
- `WebFetch(domain:*)` - All domains (too permissive)
- File access to `.env*` files

### Require Confirmation ⚠️
Add these to `ask`:
- `Bash(git:commit)` - Review commits before creation
- `Bash(git:push)` - Control when code is pushed
- `Bash(npm:publish)` - Prevent accidental package publishing
- `Bash(docker:compose)` - Control infrastructure changes

### Safe to Allow ✅
Generally safe for `allow`:
- `Bash(node:*)` - Node.js execution
- `Bash(npm:install)` - Dependency installation
- `Bash(git:status)` - Read-only git commands
- `Bash(git:diff)` - Read-only git commands
- `WebFetch(domain:github.com)` - GitHub access
- `WebFetch(domain:npmjs.com)` - npm registry access

## Configuration Best Practices

### 1. Start Restrictive
Begin with minimal permissions and add as needed.

### 2. Use Specific Patterns
Prefer specific permissions over wildcards:
```json
// Good
"Bash(npm:install)",
"Bash(npm:run:dev)"

// Less secure
"Bash(npm:*)"
```

### 3. Review Regularly
Audit permissions monthly and remove unused ones.

### 4. Document Changes
When adding permissions, document why in git commit:
```bash
git commit -m "chore: add npm WebFetch permission for dependency lookup"
```

### 5. Never Commit Secrets
Ensure `.claude/` contains no sensitive data before allowing file access.

## Troubleshooting

### Claude Code Asks for Permission Repeatedly
**Cause**: Permission not in `allow` list
**Solution**: Add to `allow` or accept that confirmation is required

### Permission Denied Errors
**Cause**: Command/domain in `deny` list
**Solution**: Remove from `deny` or use alternative approach

### Unexpected Behavior
**Cause**: Overly permissive configuration
**Solution**: Review and restrict permissions

## Migration Guide

### From No Configuration
If starting fresh:
1. Create `.claude/settings.local.json`
2. Copy minimal setup from above
3. Add permissions as needed

### Updating Existing Configuration
If updating configuration:
1. Backup current `.claude/settings.local.json`
2. Review current permissions
3. Remove unused permissions
4. Add new permissions as needed
5. Test with Claude Code

## Version Control

### Gitignore Configuration
Ensure `.gitignore` includes:
```
# Claude Code
.claude/settings.local.json
.claude/*.local.*
```

### Shared Configuration
For team-wide settings, create:
`.claude/settings.json` (committed)

And override locally with:
`.claude/settings.local.json` (not committed)

## Related Documentation

- [Claude Code README](./README.md)
- [AI Agent Guidelines](../../workflows/ai-agent-guidelines.md)
- [Security Policy](../../../SECURITY.md)

## Updates & Maintenance

**Last Updated**: 2025-10-13
**Next Review**: 2025-11-13
**Owner**: Development Team
