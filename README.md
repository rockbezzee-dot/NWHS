# Discord-Roblox Bridge Bot

A Node.js bot that bridges Discord, a web server (Express), and a Roblox game together.

## Features

- 🤖 Discord bot with command support
- 🎮 Roblox group join request automation
- 🌐 Express web server for game-to-bot communication
- 🔐 Permission level system based on Discord roles
- 🔄 Auto-approval of Roblox join requests for verified Discord users
- 🔒 Global game lock/unlock via Discord commands

## Setup Instructions

### 1. Prerequisites

- Node.js 16+ installed
- Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))
- Roblox Account Cookie (.ROBLOSECURITY - obtain by logging in and checking browser cookies)
- Roblox Group ID
- Discord Guild ID and Staff Role ID
- Bloxlink API access (free, public API)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd nwhs

# Install dependencies
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
DISCORD_TOKEN=your_bot_token
ROBLOSECURITY=your_roblox_cookie
ROBLOX_GROUP_ID=12345678
DISCORD_GUILD_ID=your_guild_id
STAFF_ROLE_ID=your_role_id
PORT=3000
```

### 4. Running the Bot

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

## How It Works

### Discord Commands

- **`!start-session`** - Unlocks the game (sets `gameLocked = false`)
- **`!end-session`** - Locks the game (sets `gameLocked = true`)

Only users with the configured staff role can use these commands.

### Roblox Join Request Processing

1. Bot checks for pending join requests every 5 minutes
2. For each requester, it:
   - Gets their Discord ID via Bloxlink API
   - Checks if they have the staff role in Discord
   - Auto-approves if they do

### Web Server Endpoint

**POST `/get-staff-perms`**

Request body:
```json
{
  "robloxId": "123456789"
}
```

Response:
```json
{
  "robloxId": "123456789",
  "discordId": "987654321",
  "permissionLevel": 1,
  "gameLocked": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Permission levels:
- `0` - No special permissions / not linked
- `1` - Staff level
- `2` - Moderator level
- `3` - Admin level

**GET `/health`**

Health check endpoint to verify bot status:
```json
{
  "status": "online",
  "discordConnected": true,
  "robloxLoggedIn": true,
  "gameLocked": false
}
```

## Roblox Game Integration

In your Roblox game, send a request to the bot's web server:

```lua
local HttpService = game:GetService("HttpService")
local playerId = game.Players.LocalPlayer.UserId

local response = HttpService:PostAsync(
  "http://your-server:3000/get-staff-perms",
  HttpService:JSONEncode({robloxId = playerId}),
  Enum.HttpContentType.ApplicationJson
)

local data = HttpService:JSONDecode(response)
print("Permission Level:", data.permissionLevel)
print("Game Locked:", data.gameLocked)
```

## Troubleshooting

### Bot won't connect to Discord
- Check `DISCORD_TOKEN` is correct
- Verify bot has proper intents enabled in Discord Developer Portal
- Check firewall/network settings

### Roblox login fails
- Verify `.ROBLOSECURITY` cookie is still valid (may need to refresh)
- Check internet connection
- Ensure noblox.js is updated

### Bloxlink API fails
- Confirm Roblox user is linked via Bloxlink website
- Check API rate limits (free tier has limits)
- Verify internet connection

### Web server unreachable from Roblox
- Check firewall rules
- Verify PORT is correctly configured
- Use proper IP/domain when calling from Roblox

## Dependencies

- **discord.js** - Discord bot framework
- **noblox.js** - Roblox API wrapper
- **express** - Web server framework
- **axios** - HTTP client for API calls
- **dotenv** - Environment variable management

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Keep `.ROBLOSECURITY` cookie secret
- Use environment variables for all sensitive data
- Consider using HTTPS for production web server
- Implement additional auth/validation as needed

## License

ISC
