# Claude Code Integration

This document describes the Claude Code AI assistant infrastructure for this project.

## Overview

Claude Code is Anthropic's official CLI for Claude AI integration into development workflows. This project uses Claude Code for:
- **Code Generation**: Creating new features and components
- **Code Review**: Analyzing code quality and suggesting improvements
- **Documentation**: Generating and maintaining project documentation
- **Debugging**: Helping identify and fix issues
- **Refactoring**: Improving code structure and maintainability

## Configuration

### Location
`.claude/settings.local.json`

### Current Permissions
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",  // Allow fetching from GitHub
      "Bash(node:*)"                   // Allow Node.js commands
    ],
    "deny": [],
    "ask": []
  }
}
```

### Permission Categories

#### Allowed (No Confirmation)
- **WebFetch(domain:github.com)**: Fetch documentation and code from GitHub repositories
- **Bash(node:\*)**: Execute Node.js, npm, and related commands without asking

#### Ask (Requires Confirmation)
- All other bash commands
- File modifications
- Network requests to non-GitHub domains

#### Denied (Blocked)
- None currently

## AI Agent Guidelines

See [docs/workflows/ai-agent-guidelines.md](../workflows/ai-agent-guidelines.md) for detailed instructions on how AI assistants should work with this codebase.

## Common Use Cases

### 1. Feature Development
```bash
# Ask Claude Code to implement a feature
"Implement the private server invitations feature from docs/03-solutioning/features/private-server-invitations/"
```

### 2. Bug Fixing
```bash
# Ask Claude Code to debug an issue
"There's a bug in src/app/api/servers/route.ts where server creation fails. Can you investigate?"
```

### 3. Documentation
```bash
# Ask Claude Code to update docs
"Update the API documentation to reflect the new /api/servers/invite endpoint"
```

### 4. Code Review
```bash
# Ask Claude Code to review code
"Review the changes in src/app/infrastructure/[serverId]/page.tsx for security issues"
```

### 5. Refactoring
```bash
# Ask Claude Code to refactor
"Refactor the authentication logic in src/lib/auth-prisma.ts to be more modular"
```

## Best Practices

### Do's ✅
- **Be Specific**: Provide clear, detailed instructions
- **Reference Docs**: Point to relevant documentation files
- **Use Context**: Reference existing code files when relevant
- **Verify Output**: Always review generated code before committing
- **Follow Conventions**: Ensure Claude Code follows project conventions from AGENTS.md

### Don'ts ❌
- **Don't Skip Testing**: Always test generated code
- **Don't Auto-Commit**: Review changes before committing
- **Don't Ignore Errors**: Address errors Claude Code flags
- **Don't Bypass Security**: Don't disable security checks

## Integration with Development Workflow

### Phase 1: Analysis
Claude Code can help with:
- Researching similar implementations
- Analyzing user feedback
- Reviewing competitive features

### Phase 2: Planning
Claude Code can help with:
- Breaking down features into tasks
- Estimating complexity
- Identifying technical risks

### Phase 3: Solutioning
Claude Code can help with:
- Designing architecture
- Creating API contracts
- Writing technical specifications

### Phase 4: Implementation
Claude Code can help with:
- Writing code
- Creating tests
- Updating documentation
- Reviewing code quality

## Troubleshooting

### Claude Code Not Responding
1. Check network connection
2. Verify Claude Code is running: `claude-code --version`
3. Check logs: `~/.claude-code/logs/`

### Permission Errors
1. Review `.claude/settings.local.json`
2. Add required permissions to `allow` array
3. Restart Claude Code session

### Unexpected Behavior
1. Review conversation history
2. Provide more specific instructions
3. Reference existing documentation
4. Use AGENTS.md guidelines

## Configuration Updates

To update Claude Code configuration:

1. Edit `.claude/settings.local.json`
2. Add/remove permissions as needed
3. Restart Claude Code session

### Example: Adding WebFetch for npm Registry
```json
{
  "permissions": {
    "allow": [
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.com)",  // New permission
      "Bash(node:*)"
    ]
  }
}
```

## Resources

- [Claude Code Official Docs](https://docs.claude.com/claude-code)
- [AI Agent Guidelines](../workflows/ai-agent-guidelines.md)
- [Development Workflow](../workflows/feature-development.md)

## Support

For Claude Code issues:
- GitHub Issues: https://github.com/anthropics/claude-code/issues
- Documentation: https://docs.claude.com/claude-code

For project-specific questions:
- Contact: nodediver@proton.me
- Repository: https://github.com/NodeDiver/subscriptn-simple
