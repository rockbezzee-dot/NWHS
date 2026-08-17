@echo off
REM Discord-Roblox Bridge Bot - Setup Configuration Script (Windows)
REM This script helps you easily configure the bot with your credentials

setlocal enabledelayedexpansion

echo ========================================
echo Discord-Roblox Bridge Bot Setup
echo ========================================
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
) else (
    echo ℹ️  .env file already exists
)

echo.
echo 📝 Enter your configuration details:
echo (Press Enter to skip any field)
echo.

REM Discord Token
set /p DISCORD_TOKEN="Discord Bot Token: "
if not "!DISCORD_TOKEN!"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_discord_bot_token_here', '!DISCORD_TOKEN!' | Set-Content .env"
    echo ✅ Discord Token saved
)

REM Roblox Cookie
set /p ROBLOSECURITY="Roblox .ROBLOSECURITY Cookie: "
if not "!ROBLOSECURITY!"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_roblox_cookie_here', '!ROBLOSECURITY!' | Set-Content .env"
    echo ✅ Roblox Cookie saved
)

REM Roblox Group ID
set /p ROBLOX_GROUP_ID="Roblox Group ID: "
if not "!ROBLOX_GROUP_ID!"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_group_id_here', '!ROBLOX_GROUP_ID!' | Set-Content .env"
    echo ✅ Roblox Group ID saved
)

REM Discord Guild ID
set /p DISCORD_GUILD_ID="Discord Guild (Server) ID: "
if not "!DISCORD_GUILD_ID!"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_guild_id_here', '!DISCORD_GUILD_ID!' | Set-Content .env"
    echo ✅ Discord Guild ID saved
)

REM Discord Staff Role ID
set /p STAFF_ROLE_ID="Discord Staff Role ID: "
if not "!STAFF_ROLE_ID!"=="" (
    powershell -Command "(Get-Content .env) -replace 'your_staff_role_id_here', '!STAFF_ROLE_ID!' | Set-Content .env"
    echo ✅ Discord Staff Role ID saved
)

REM Port (optional)
set /p PORT="Web Server Port (default: 3000): "
if not "!PORT!"=="" (
    powershell -Command "(Get-Content .env) -replace 'PORT=3000', 'PORT=!PORT!' | Set-Content .env"
    echo ✅ Port saved
)

echo.
echo ========================================
echo ✅ Configuration Complete!
echo ========================================
echo.
echo Your .env file has been updated with:
echo   • Discord Bot Token
echo   • Roblox .ROBLOSECURITY Cookie
echo   • Roblox Group ID
echo   • Discord Guild ID
echo   • Discord Staff Role ID
echo.
echo You can now run the bot with:
echo   npm start       (Production)
echo   npm run dev     (Development with auto-reload)
echo.
pause
