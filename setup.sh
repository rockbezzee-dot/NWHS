#!/bin/bash

# Discord-Roblox Bridge Bot - Setup Configuration Script
# This script helps you easily configure the bot with your credentials

echo "========================================"
echo "Discord-Roblox Bridge Bot Setup"
echo "========================================"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
else
    echo "ℹ️  .env file already exists"
fi

echo ""
echo "📝 Enter your configuration details:"
echo "(Press Enter to skip any field)"
echo ""

# Discord Token
read -p "Discord Bot Token: " DISCORD_TOKEN
if [ ! -z "$DISCORD_TOKEN" ]; then
    sed -i.bak "s|your_discord_bot_token_here|$DISCORD_TOKEN|g" .env
    echo "✅ Discord Token saved"
fi

# Roblox Cookie
read -p "Roblox .ROBLOSECURITY Cookie: " ROBLOSECURITY
if [ ! -z "$ROBLOSECURITY" ]; then
    sed -i.bak "s|your_roblox_cookie_here|$ROBLOSECURITY|g" .env
    echo "✅ Roblox Cookie saved"
fi

# Roblox Group ID
read -p "Roblox Group ID: " ROBLOX_GROUP_ID
if [ ! -z "$ROBLOX_GROUP_ID" ]; then
    sed -i.bak "s|your_group_id_here|$ROBLOX_GROUP_ID|g" .env
    echo "✅ Roblox Group ID saved"
fi

# Discord Guild ID
read -p "Discord Guild (Server) ID: " DISCORD_GUILD_ID
if [ ! -z "$DISCORD_GUILD_ID" ]; then
    sed -i.bak "s|your_guild_id_here|$DISCORD_GUILD_ID|g" .env
    echo "✅ Discord Guild ID saved"
fi

# Discord Staff Role ID
read -p "Discord Staff Role ID: " STAFF_ROLE_ID
if [ ! -z "$STAFF_ROLE_ID" ]; then
    sed -i.bak "s|your_staff_role_id_here|$STAFF_ROLE_ID|g" .env
    echo "✅ Discord Staff Role ID saved"
fi

# Port (optional)
read -p "Web Server Port (default: 3000): " PORT
if [ ! -z "$PORT" ]; then
    sed -i.bak "s|PORT=3000|PORT=$PORT|g" .env
    echo "✅ Port saved"
fi

# Clean up backup files
rm -f .env.bak

echo ""
echo "========================================"
echo "✅ Configuration Complete!"
echo "========================================"
echo ""
echo "Your .env file has been updated with:"
echo "  • Discord Bot Token"
echo "  • Roblox .ROBLOSECURITY Cookie"
echo "  • Roblox Group ID"
echo "  • Discord Guild ID"
echo "  • Discord Staff Role ID"
echo ""
echo "You can now run the bot with:"
echo "  npm start       (Production)"
echo "  npm run dev     (Development with auto-reload)"
echo ""
