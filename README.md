# DiscordEasy

***DiscordEasy*** is a JavaScript module that simplifies the development of Discord bots using ***discord.js***. It makes it easy to manage commands, events, and interact with a database.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Commands and Events](#commands-and-events)
- [Database Connection](#database-connection)
- [Intent Configuration](#intent-configuration)
- [Enable/Disable Debugging](#enable-disable-debugging)
- [Contributing](#contributing)

## Features

- Easy management of message commands and slash commands.
- Built-in event system to handle Discord events.
- Optional MySQL database connection.
- Support for custom intents.
- Debug mode for better log visibility.

## Installation

1. Clone this repository or download the files.
2. Install the dependencies using npm:

   ```bash
   npm install discord.js mysql2 nyx-logger
   ```

Make sure you have a Discord bot set up and retrieve your token, client ID, and guild ID.
# Usage
- Here’s a basic example of how to create a bot with DiscordEasy:

```js
const { GatewayIntentBits } = require('discord.js');
const DiscordEasy = require('discord-easy');

const bot = new DiscordEasy(
    'YOUR_BOT_TOKEN', // Token
    'YOUR_CLIENT_ID', // Client ID
    'YOUR_GUILD_ID', // Guild ID
    '!', // Prefix for message commands
    true, // Enable slash commands
    true  // Enable message commands
);

// Add databse 
bot.addDatabase("your_host", "your_user", "your_password", "your_database"); // Not nessecary

// Add custom intents
bot.addIntents(GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers);

// Set the path for commands and events
bot.setPath('command', './commands');
bot.setPath('event', './events');

// Run the bot
bot.run();
```

# Commands and Events

- Adding a Message Command to add a message command, create a JavaScript file in the commands folder:

```js
module.exports = {
    name: 'hello',
    execute(message) {
        message.channel.send('Hello, World!');
    }
};
```

# Adding an Event
- To add an event, create a JavaScript file in the events folder:

```js
module.exports = {
    name: 'ready',
    register(bot) {
        bot.client.on('ready', () => {
            console.log.print('Bot is online!');
        });
    }
};
```

# Database Connection
- If you want to connect your bot to a MySQL database, use the addDatabase method:

```js
bot.addDatabase("your_host", "your_user", "your_password", "your_database");
```

# Intent Configuration
- To add additional intents, use the addIntents method:

```js
bot.addIntents(GatewayIntentBits.GuildMembers);
```

# Contributing
- Contributions are welcome! If you have suggestions or want to add new features, feel free to open an issue or submit a pull request.
