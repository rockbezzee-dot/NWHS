require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const noblox = require('noblox.js');
const express = require('express');
const axios = require('axios');

// Global variables
let gameLocked = false;
let robloxLoggedIn = false;

// Discord Client Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Express Server Setup
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ==================== ROBLOX SETUP ====================

/**
 * Initialize Roblox login
 */
async function initializeRoblox() {
  try {
    console.log('[ROBLOX] Attempting to log in...');
    await noblox.setCookie(process.env.ROBLOSECURITY);
    const userInfo = await noblox.getCurrentUser();
    console.log(`[ROBLOX] Successfully logged in as: ${userInfo.username}`);
    robloxLoggedIn = true;
    return true;
  } catch (error) {
    console.error('[ROBLOX] Failed to log in:', error.message);
    robloxLoggedIn = false;
    return false;
  }
}

/**
 * Check pending join requests for Roblox group
 */
async function checkPendingRequests() {
  if (!robloxLoggedIn) return;

  try {
    const groupId = parseInt(process.env.ROBLOX_GROUP_ID);
    const requests = await noblox.getJoinRequests(groupId);

    if (!requests || requests.length === 0) {
      console.log('[ROBLOX] No pending join requests');
      return;
    }

    console.log(`[ROBLOX] Found ${requests.length} pending join request(s)`);

    for (const request of requests) {
      await processJoinRequest(request, groupId);
    }
  } catch (error) {
    console.error('[ROBLOX] Error checking pending requests:', error.message);
  }
}

/**
 * Process individual join request
 */
async function processJoinRequest(request, groupId) {
  try {
    const userId = request.requester.userId;
    console.log(`[ROBLOX] Processing join request from user ID: ${userId}`);

    // Get Discord ID from Bloxlink API
    const discordId = await getDiscordIdFromRobloxId(userId);

    if (!discordId) {
      console.log(`[ROBLOX] No Discord ID found for Roblox user ${userId}`);
      return;
    }

    // Check if user has staff role
    const hasStaffRole = await checkUserDiscordRole(discordId);

    if (hasStaffRole) {
      // Auto-approve the join request
      await noblox.handleJoinRequest(groupId, userId, true);
      console.log(`[ROBLOX] Auto-approved join request for user ${userId} (Discord: ${discordId})`);
    } else {
      console.log(`[ROBLOX] User ${userId} does not have required Discord role`);
    }
  } catch (error) {
    console.error('[ROBLOX] Error processing join request:', error.message);
  }
}

/**
 * Get Discord ID from Roblox ID via Bloxlink API
 */
async function getDiscordIdFromRobloxId(robloxId) {
  try {
    const response = await axios.get(
      `${process.env.BLOXLINK_API_URL}/public/roblox/${robloxId}`
    );

    if (response.data && response.data.discord) {
      return response.data.discord.id;
    }

    return null;
  } catch (error) {
    console.error(`[BLOXLINK] Error fetching Discord ID for Roblox ${robloxId}:`, error.message);
    return null;
  }
}

/**
 * Check if Discord user has staff role
 */
async function checkUserDiscordRole(discordId) {
  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
    const member = await guild.members.fetch(discordId);

    if (!member) {
      console.log(`[DISCORD] Member not found: ${discordId}`);
      return false;
    }

    const hasRole = member.roles.cache.has(process.env.STAFF_ROLE_ID);
    return hasRole;
  } catch (error) {
    console.error(`[DISCORD] Error checking user role:`, error.message);
    return false;
  }
}

// ==================== DISCORD SETUP ====================

client.on('ready', async () => {
  console.log(`[DISCORD] Bot logged in as ${client.user.tag}`);
  
  // Initialize Roblox
  await initializeRoblox();
  
  // Start checking pending requests every 5 minutes
  setInterval(checkPendingRequests, 5 * 60 * 1000);
  console.log('[ROBLOX] Starting pending request check loop (every 5 minutes)');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Check if user has staff role
  const hasStaffRole = message.member.roles.cache.has(process.env.STAFF_ROLE_ID);
  if (!hasStaffRole) {
    return message.reply('You do not have permission to use this command.');
  }

  if (command === 'start-session') {
    gameLocked = false;
    console.log('[COMMAND] !start-session - Game unlocked');
    return message.reply('✅ Game session started - players can now join!');
  }

  if (command === 'end-session') {
    gameLocked = true;
    console.log('[COMMAND] !end-session - Game locked');
    return message.reply('🔒 Game session ended - no new players can join!');
  }
});

// ==================== EXPRESS WEB SERVER ====================

/**
 * Map Discord role to permission level
 */
async function getUserPermissionLevel(discordId) {
  try {
    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
    const member = await guild.members.fetch(discordId);

    if (!member) {
      return 0; // No permission
    }

    // Check roles from highest to lowest priority
    // Adjust role IDs based on your server setup
    if (member.roles.cache.has(process.env.STAFF_ROLE_ID)) {
      return parseInt(process.env.STAFF_LEVEL) || 1;
    }

    return 0; // Default - no special permissions
  } catch (error) {
    console.error('[WEB] Error getting user permission level:', error.message);
    return 0;
  }
}

/**
 * Main endpoint for Roblox game server
 */
app.post('/get-staff-perms', async (req, res) => {
  try {
    const { robloxId } = req.body;

    if (!robloxId) {
      return res.status(400).json({ error: 'Missing robloxId' });
    }

    console.log(`[WEB] Received request for Roblox ID: ${robloxId}`);

    // Get Discord ID from Roblox ID
    const discordId = await getDiscordIdFromRobloxId(robloxId);

    if (!discordId) {
      return res.status(200).json({
        permissionLevel: 0,
        gameLocked: gameLocked,
        error: 'User not linked to Discord',
      });
    }

    // Get permission level
    const permissionLevel = await getUserPermissionLevel(discordId);

    return res.status(200).json({
      robloxId: robloxId,
      discordId: discordId,
      permissionLevel: permissionLevel,
      gameLocked: gameLocked,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[WEB] Error in /get-staff-perms:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    discordConnected: client.isReady(),
    robloxLoggedIn: robloxLoggedIn,
    gameLocked: gameLocked,
  });
});

// ==================== SERVER START ====================

async function start() {
  try {
    // Start Express server
    app.listen(PORT, () => {
      console.log(`[WEB] Express server running on port ${PORT}`);
    });

    // Login Discord bot
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('[ERROR] Failed to start bot:', error.message);
    process.exit(1);
  }
}

start();
