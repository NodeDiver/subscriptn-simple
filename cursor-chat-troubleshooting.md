# Cursor Chat "Generating" Issue - Troubleshooting Guide

This guide addresses the issue where Cursor chat gets stuck at "generating" indefinitely without providing any response. This is a known issue that can occur in versions 1.2.2 through 1.2.4 and other versions.

## Common Causes

1. **Large chat history** - The most common cause
2. **Corrupted cache or workspace storage**
3. **Extension conflicts**
4. **Memory issues or crashes**
5. **Network connectivity problems**
6. **Corrupted chat sessions**

## Solutions (Try in Order)

### 1. Start a New Chat
The quickest solution is often to simply start a new chat:
- Click the "+" button to create a new chat
- Avoid using old chat sessions that were previously working

### 2. Clear Chat History
Large chat histories can cause the AI to timeout. Clear old chats:

**For Linux:**
```bash
rm -rf ~/.config/Cursor/User/workspaceStorage
```

**For macOS:**
```bash
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage
```

**For Windows:**
```
rmdir /s %APPDATA%\Cursor\User\workspaceStorage
```

### 3. Clear Cursor Cache
Clear all cache to resolve potential corruption:

**For Linux:**
```bash
rm -rf ~/.config/Cursor/Cache
rm -rf ~/.config/Cursor/CachedData
rm -rf ~/.config/Cursor/Code\ Cache
```

**For macOS:**
```bash
rm -rf ~/Library/Application\ Support/Cursor/Cache
rm -rf ~/Library/Application\ Support/Cursor/CachedData
rm -rf ~/Library/Application\ Support/Cursor/Code\ Cache
```

**For Windows:**
```
rmdir /s "%APPDATA%\Cursor\Cache"
rmdir /s "%APPDATA%\Cursor\CachedData"
rmdir /s "%APPDATA%\Cursor\Code Cache"
```

### 4. Run Cursor in Safe Mode
Test if extensions are causing the issue:
```bash
cursor --disable-extensions
```

If this works, disable extensions one by one to find the problematic one.

### 5. Check Developer Console
Open developer tools to see specific errors:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
2. Type "Developer: Toggle Developer Tools"
3. Check the Console tab for errors

Common errors to look for:
- "Git model not found"
- "Unable to read file" errors
- "No composer data handle found"

### 6. Reinstall Cursor Completely

1. **Uninstall Cursor** through your system's application manager
2. **Delete all Cursor data:**

**Linux:**
```bash
rm -rf ~/.config/Cursor
rm -rf ~/.cursor
```

**macOS:**
```bash
rm -rf ~/Library/Application\ Support/Cursor
rm -rf ~/.cursor
```

**Windows:**
```
rmdir /s "%APPDATA%\Cursor"
rmdir /s "%USERPROFILE%\.cursor"
```

3. **Download and install the latest version** from [cursor.com](https://cursor.com)

### 7. Memory and Performance Issues
If Cursor is using excessive CPU (>600%) or memory:
- Close other applications
- Restart your computer
- Monitor Activity Monitor (macOS) or Task Manager (Windows)
- Consider upgrading RAM if consistently running out of memory

### 8. Network and API Issues
- Check your internet connection
- Try a different network (mobile hotspot)
- Verify your Cursor account is active and properly logged in
- Check if you have API credits remaining

### 9. Project-Specific Issues
If the issue only occurs with one project:
- Try renaming or moving the project folder
- Create a new workspace for the project
- Check for very large files or folders that might be causing issues

## Prevention Tips

1. **Regularly clear old chats** - Don't let chat history accumulate
2. **Start new chats** for different topics instead of very long conversations
3. **Keep extensions updated** and remove unused ones
4. **Monitor system resources** when using Cursor
5. **Save important chats** using the SpecStory extension before clearing history

## If Nothing Works

1. **Export your settings** (if possible)
2. **Contact Cursor support** with:
   - Your Cursor version (Help → About Cursor)
   - Operating system details
   - Screenshot of any error messages
   - Developer console logs
3. **Try an older stable version** temporarily while waiting for a fix

## Additional Notes

- The issue often relates to the chat context becoming too large for the AI to process efficiently
- Some users report that editing the last message in a stuck chat can sometimes revive it
- This issue has been reported across multiple Cursor versions and operating systems