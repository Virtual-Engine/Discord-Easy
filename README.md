# DiscordEasy

***DiscordEasy*** is a simplified module for creating Discord bots using ***discord.js***. It allows easy management of message commands and slash commands, as well as adding events to your bot.

# Prerequisites

- Node.js v16 or higher
- npm (usually installed with Node.js)
- A configured Discord application with a bot.

# Installation

1. Clone the repository or download the necessary files.
2. Make sure you have installed the required dependencies. Run in your terminal:

```bash
   npm install discord.js nyx-logger mysql2
```

# Usage

Example Code

Here’s a basic example of how to use DiscordEasy:

```js
const DiscordEasy = require('discord-easy');
const { Events } = require('discord.js');
const { log } = require('nyx-logger');

const token = 'YOUR_TOKEN_HERE'; // Replace with your token
const clientId = 'YOUR_CLIENT_ID_HERE'; // Replace with your client ID
const guildId = 'YOUR_GUILD_ID_HERE'; // Replace with your server ID
const prefix = '!';

const useSlashCommands = false; // Set to true to enable slash commands
const useMessageCommands = true; // Set to true to enable message commands

const bot = new DiscordEasy(token, clientId, guildId, prefix, useSlashCommands, useMessageCommands);

// Add a database connection
bot.addDatabase("your_host", "your_user", "your_password", "your_database"); // Not nessecary

// 'ready' event
bot.addEvent(Events.ClientReady, async () => {
    log("info", `Bot is ready and logged in as ${bot.client.user.tag}`);
});

// Add a slash command
bot.addSlashCommand({
    name: 'hello',
    description: 'Replies with a welcome message',
    execute: async (interaction) => {
        await interaction.reply(`Hello ${interaction.user.username}!`);
    },
});

// Add a message command
bot.addMessageCommand({
    name: 'hello2',
    execute: async (message) => {
        await message.channel.send(`Hello ${message.author.username}!`);
    },
});

// Start the bot
bot.run();
```

Methods
## addDatabase(host, user, password, database)
### Parameters:
- host: Database server address.
- user: Database username.
- password: Database password.
- database: Name of the database.
## addEvent(eventName, callback)
### Parameters:
- eventName: Name of the event to listen to (e.g., Events.ClientReady).
- callback: Function to execute when the event occurs.
## addSlashCommand(command)
### Parameters:
- command: An object containing the properties name, description (not nessecary), and execute.
## addMessageCommand(command)
### Parameters:
- command: An object containing the property name and execute.
## run()
- Starts the bot and connects the Discord client.
## Help
- For any questions or assistance, dm me on discord or join my discord