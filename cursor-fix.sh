#!/bin/bash

# Cursor Chat Fix Script for Linux
# This script helps fix the "generating indefinitely" issue

echo "Cursor Chat Fix Script"
echo "====================="
echo ""
echo "This script will help fix Cursor chat issues by clearing cache and history."
echo "Make sure Cursor is closed before proceeding."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Check if Cursor is running
if pgrep -x "cursor" > /dev/null; then
    echo "⚠️  Cursor is currently running. Please close it first."
    exit 1
fi

echo ""
echo "Choose an option:"
echo "1) Quick fix - Clear chat history only"
echo "2) Full cleanup - Clear all cache and history"
echo "3) Complete reset - Remove all Cursor data (requires reinstall)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Clearing chat history..."
        rm -rf ~/.config/Cursor/User/workspaceStorage
        echo "✅ Chat history cleared"
        ;;
    2)
        echo "Clearing cache and history..."
        rm -rf ~/.config/Cursor/User/workspaceStorage
        rm -rf ~/.config/Cursor/Cache
        rm -rf ~/.config/Cursor/CachedData
        rm -rf ~/.config/Cursor/Code\ Cache
        echo "✅ Cache and history cleared"
        ;;
    3)
        echo "⚠️  WARNING: This will remove all Cursor settings and data!"
        read -p "Are you sure? (y/N): " confirm
        if [[ $confirm == [yY] ]]; then
            echo "Removing all Cursor data..."
            rm -rf ~/.config/Cursor
            rm -rf ~/.cursor
            echo "✅ All Cursor data removed. Please reinstall Cursor."
        else
            echo "Operation cancelled."
        fi
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "Done! You can now start Cursor and try using the chat again."
echo ""
echo "Additional tips:"
echo "- Start a new chat instead of using old ones"
echo "- If the issue persists, try running: cursor --disable-extensions"
echo "- Check the troubleshooting guide in cursor-chat-troubleshooting.md"