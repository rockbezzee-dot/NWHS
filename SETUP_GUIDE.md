# Discord-Roblox Bridge Bot - Complete Setup Guide

## 📦 Project Files

Your repository now contains everything needed to run the bot:

### Core Files
- **src/index.js** - Main bot application with Discord, Roblox, and Express integration
- **package.json** - Dependencies and scripts
- **.env.example** - Environment variables template

### Setup Files (Choose One)
- **setup.js** - Node.js interactive setup (Recommended - cross-platform) ⭐
- **setup.sh** - Bash script for Mac/Linux
- **setup.bat** - Batch script for Windows

### Other Files
- **README.md** - Full documentation
- **.gitignore** - Git ignore rules

---

## 🚀 Quick Start Guide

### Option 1: Cross-Platform Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/rockbezzee-dot/nwhs.git
cd nwhs

# 2. Install dependencies
npm install

# 3. Run interactive setup
npm run setup

# 4. Start the bot
npm start
```

### Option 2: Windows Setup

```bash
# 1. Clone the repository
git clone https://github.com/rockbezzee-dot/nwhs.git
cd nwhs

# 2. Install dependencies
npm install

# 3. Run Windows setup
setup.bat

# 4. Start the bot
npm start
```

### Option 3: Mac/Linux Setup

```bash
# 1. Clone the repository
git clone https://github.com/rockbezzee-dot/nwhs.git
cd nwhs

# 2. Install dependencies
npm install

# 3. Run bash setup
bash setup.sh

# 4. Start the bot
npm start
```

---

## 🔐 What Credentials You'll Need

When running setup, you'll be prompted for:

| Credential | Where to Get It |
|-----------|-----------------|
| **Discord Bot Token** | [Discord Developer Portal](https://discord.com/developers/applications) → Create App → Copy Token |
| **Roblox .ROBLOSECURITY** | Login to Roblox → F12 Developer Tools → Application → Cookies → Copy .ROBLOSECURITY value |
| **Roblox Group ID** | Your Roblox group URL contains it: `roblox.com/groups/**12345678**/` |
| **Discord Guild ID** | Right-click Discord server → Copy Server ID |
| **Discord Staff Role ID** | Right-click staff role in Discord → Copy Role ID |
| **Web Server Port** | (Optional) Default is 3000 |

---

## ⚙️ How The Bot Works

### 1. Discord Commands
Users with the staff role can run:
- **`!start-session`** - Unlocks the game for players
- **`!end-session`** - Locks the game for new players

### 2. Roblox Auto-Approval
Every 5 minutes:
- Bot checks for pending join requests to your Roblox group
- Gets Discord ID from Roblox ID via Bloxlink API
- Auto-approves requests from users with the Discord staff role

### 3. Web Server Endpoint
Game sends request to: `POST /get-staff-perms`

**Request:**
```json
{
  "robloxId": "123456789"
}
```

**Response:**
```json
{
  "robloxId": "123456789",
  "discordId": "987654321",
  "permissionLevel": 1,
  "gameLocked": false,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📝 Running the Bot

### Production Mode
```bash
npm start
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Health Check
```bash
curl http://localhost:3000/health
```

---

## 🛠️ Roblox Game Integration

Example code for your Roblox game (Luau):

```lua
local HttpService = game:GetService("HttpService")
local playerId = game.Players.LocalPlayer.UserId

local function checkPermissions()
    local response = HttpService:PostAsync(
        "http://your-server-ip:3000/get-staff-perms",
        HttpService:JSONEncode({robloxId = playerId}),
        Enum.HttpContentType.ApplicationJson
    )
    
    local data = HttpService:JSONDecode(response)
    
    print("Permission Level:", data.permissionLevel)
    print("Game Locked:", data.gameLocked)
    
    if data.gameLocked then
        print("Game is currently locked!")
    end
    
    return data
end

checkPermissions()
```

---

## 🔧 Troubleshooting

### Bot won't connect to Discord
- ✅ Check Discord Bot Token is correct
- ✅ Enable Message Content Intent in Discord Developer Portal
- ✅ Check firewall/network

### Roblox login fails
- ✅ Verify .ROBLOSECURITY cookie is still valid
- ✅ Cookies expire - may need to refresh
- ✅ Check internet connection

### Bloxlink API returns no Discord ID
- ✅ User must be linked via [Bloxlink](https://bloxlink.com)
- ✅ Check Bloxlink hasn't rate-limited you
- ✅ Verify user's Roblox account is public

### Web server unreachable from Roblox
- ✅ Check firewall allows traffic on your PORT
- ✅ Use correct IP/domain in Roblox script
- ✅ Port must match in .env file
- ✅ Server must be running

---

## 🔒 Security Best Practices

⚠️ **IMPORTANT:**
- Never commit `.env` file to GitHub
- Keep `.ROBLOSECURITY` cookie private
- Use environment variables for all secrets
- Consider using HTTPS for production
- Implement additional authentication if needed
- Rotate your Discord token if compromised

---

## 📊 Permission Levels

The system supports multiple permission levels:

| Level | Name | Features |
|-------|------|----------|
| 0 | None | No access / not linked |
| 1 | Staff | Basic admin features |
| 2 | Moderator | Enhanced moderator features |
| 3 | Admin | Full admin access |

Customize these in your `.env` file:
```env
STAFF_LEVEL=1
MODERATOR_LEVEL=2
ADMIN_LEVEL=3
```

---

## 📦 Dependencies

- **discord.js** (^14.14.1) - Discord bot framework
- **noblox.js** (^5.2.1) - Roblox API wrapper
- **express** (^4.18.2) - Web server framework
- **axios** (^1.6.0) - HTTP client
- **dotenv** (^16.3.1) - Environment variables

---

## 🎯 Next Steps

1. ✅ Clone the repository
2. ✅ Run `npm install`
3. ✅ Run `npm run setup` and enter your credentials
4. ✅ Run `npm start` to start the bot
5. ✅ Test with `!start-session` in Discord
6. ✅ Integrate with your Roblox game

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all credentials in `.env`
3. Check console logs for error messages
4. Ensure all services are running (Discord, Roblox, Network)

---

## 📄 License

ISC
