#!/bin/bash
# A script to wrap a task prompt with the Claude compliance header and copy to clipboard.

if [ -z "$1" ]; then
  echo "Usage: ./prompt-claude.sh \"Your task prompt for Claude\""
  exit 1
fi

PROMPT_HEADER_FILE="prompts/claude_compliance_header.md"
USER_PROMPT=$1

# Check if the header file exists
if [ ! -f "$PROMPT_HEADER_FILE" ]; then
  echo "Error: Prompt header file not found at $PROMPT_HEADER_FILE"
  exit 1
fi

# Combine header and user prompt
FULL_PROMPT=$(cat "$PROMPT_HEADER_FILE")
FULL_PROMPT+="\n$USER_PROMPT"

# Copy to clipboard (macOS specific)
# For Linux, you might use `xclip -selection clipboard`
if command -v pbcopy > /dev/null; then
  echo "$FULL_PROMPT" | pbcopy
  echo "✅ Full prompt copied to clipboard!"
else
  echo "⚠️ 'pbcopy' not found. Here is the full prompt to copy manually:"
  echo "------------------------------------------------------------"
  echo "$FULL_PROMPT"
fi
