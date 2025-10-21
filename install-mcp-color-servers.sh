#!/bin/bash

# MCP Color Servers Installation Script for Ubuntu MATE
# This installs both the MCP Color Server and Color Scheme Generator

set -e  # Exit on error

echo "🎨 Installing MCP Color Servers..."
echo "=================================="

# Create a directory for MCP servers
MCP_DIR="/home/motoko/.mcp-servers"
mkdir -p "$MCP_DIR"
cd "$MCP_DIR"

# Install MCP Color Server by keyurgolani
echo ""
echo "📦 Installing MCP Color Server (keyurgolani)..."
if [ -d "ColorMcp" ]; then
    echo "⚠️  ColorMcp already exists, updating..."
    cd ColorMcp
    git pull
else
    git clone https://github.com/keyurgolani/ColorMcp.git
    cd ColorMcp
fi
npm install
npm run build
COLOR_SERVER_PATH="$(pwd)/dist/index.js"
cd "$MCP_DIR"

# Install Color Scheme Generator
echo ""
echo "📦 Installing Color Scheme Generator (deepakkumardewani)..."
if [ -d "color-scheme-mcp" ]; then
    echo "⚠️  color-scheme-mcp already exists, updating..."
    cd color-scheme-mcp
    git pull
else
    git clone https://github.com/deepakkumardewani/color-scheme-mcp.git
    cd color-scheme-mcp
fi
npm install
npm run build
SCHEME_SERVER_PATH="$(pwd)/build/index.js"
cd "$MCP_DIR"

# Get Claude Desktop config path
CLAUDE_CONFIG_DIR="/home/motoko/.config/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

echo ""
echo "📝 Configuring Claude Desktop..."
mkdir -p "$CLAUDE_CONFIG_DIR"

# Create or update Claude Desktop config
if [ ! -f "$CLAUDE_CONFIG_FILE" ]; then
    # Create new config file
    cat > "$CLAUDE_CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "mcp-color-server": {
      "command": "node",
      "args": ["/home/motoko/.mcp-servers/ColorMcp/dist/index.js"]
    },
    "color-scheme-generator": {
      "command": "node",
      "args": ["/home/motoko/.mcp-servers/color-scheme-mcp/build/index.js"]
    }
  }
}
EOF
    echo "✅ Created new Claude Desktop config"
else
    echo "⚠️  Claude Desktop config already exists at:"
    echo "   $CLAUDE_CONFIG_FILE"
    echo ""
    echo "   Please manually add these entries to your mcpServers section:"
    echo ""
    echo '   "mcp-color-server": {'
    echo '     "command": "node",'
    echo '     "args": ["/home/motoko/.mcp-servers/ColorMcp/dist/index.js"]'
    echo '   },'
    echo '   "color-scheme-generator": {'
    echo '     "command": "node",'
    echo '     "args": ["/home/motoko/.mcp-servers/color-scheme-mcp/build/index.js"]'
    echo '   }'
fi

echo ""
echo "✅ Installation Complete!"
echo "=================================="
echo ""
echo "📍 MCP Servers installed at:"
echo "   MCP Color Server: /home/motoko/.mcp-servers/ColorMcp/dist/index.js"
echo "   Color Scheme Generator: /home/motoko/.mcp-servers/color-scheme-mcp/build/index.js"
echo ""
echo "🔧 Next steps:"
echo "   1. Restart Claude Desktop"
echo "   2. Check Settings > Developer > MCP to verify servers are running"
echo "   3. Try asking Claude: 'Analyze the color scheme of my website'"
echo "   4. You can test the servers by asking about color conversions, palette generation, etc."
echo ""
echo "📚 Available Features:"
echo "   • Color format conversion (HEX, RGB, HSL, CMYK, LAB, etc.)"
echo "   • WCAG accessibility compliance checking"
echo "   • Harmonious color palette generation"
echo "   • Tailwind CSS color class generation"
echo "   • Color scheme types: monochrome, analogic, complementary, triadic"
echo ""
