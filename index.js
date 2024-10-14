const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const { log } = require('nyx-logger');
const mysql = require('mysql2');
const checkForUpdates = require("./checker");

class DiscordEasy {
    constructor(token, clientId, guildId, prefix = '!', useSlashCommands = true, useMessageCommands = true) {
        this.token = token;
        this.clientId = clientId;
        this.guildId = guildId;
        this.prefix = prefix;
        this.useSlashCommands = useSlashCommands;
        this.useMessageCommands = useMessageCommands;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.slashCommands = [];
        this.messageCommands = [];
        this.database = null;

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isCommand() || !this.useSlashCommands) return;

            const command = this.slashCommands.find(cmd => cmd.name === interaction.commandName);
            if (command) {
                await command.execute(interaction, this.database);
            }
        });

        this.client.on(Events.MessageCreate, async (message) => {
            if (!this.useMessageCommands || !message.content.startsWith(this.prefix) || message.author.bot) return;

            const args = message.content.slice(this.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            const command = this.messageCommands.find(cmd => cmd.name === commandName);
            if (command) {
                await command.execute(message, this.database);
            }
        });
    }

    async addDatabase(host, user, password, database) {
        this.database = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        log("info", 'Connected to database');
    }

    addSlashCommand(command) {
        this.slashCommands.push(command);
        log("info", `Slash Command Added: ${command.name}`);
    }

    addMessageCommand(command) {
        this.messageCommands.push(command);
        log("info", `Message Command Added: ${command.name}`);
    }

    addEvent(eventName, callback) {
        this.client.on(eventName, async (...args) => {
            try {
                await callback(...args, this.database);
            } catch (error) {
                console.error(`Error in event handler for ${eventName}:`, error);
            }
        });
        log("info", `Event listener added for: ${eventName}`);
    }

    async registerSlashCommands() {
        if (!this.useSlashCommands) return;

        const rest = new REST({ version: '9' }).setToken(this.token);
        try {
            log("info", 'Waiting for slash commands registry...');

            const commandsToRegister = this.slashCommands.filter(cmd => cmd.description);
            console.log('Commands to register:', commandsToRegister);

            await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
                body: commandsToRegister,
            });
            log("info", 'Slash commands registered');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }

    async run() {
        await this.registerSlashCommands();
        await this.checkForUpdates();
        this.client.login(this.token);
    }
}

module.exports = DiscordEasy;