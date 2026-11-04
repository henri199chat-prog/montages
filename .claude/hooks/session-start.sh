#!/bin/bash
# Installs the Agent Reach CLI and its skill in Claude Code cloud sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

export PATH="$HOME/.local/bin:$PATH"
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi

# Install from the GitHub release only; the PyPI package with the same name is a different project.
if ! command -v agent-reach >/dev/null 2>&1; then
  uv tool install https://github.com/Panniantong/Agent-Reach/releases/latest/download/agent-reach.zip >&2
fi

# setup enables the default channels and installs the skill into ~/.claude/skills.
if [ ! -f "$HOME/.claude/skills/agent-reach/SKILL.md" ]; then
  agent-reach setup >/dev/null
fi
