const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js');
const { log } = require('nyx-logger');
const mysql = require('mysql2');
const checkForUpdates = require("./checker");
const fs = require('fs');
const path = require('path');

class DiscordEasy {
    constructor(token, clientId, guildId, prefix = '!', useSlashCommands = true, useMessageCommands = true) {
        this.token = token;
        this.clientId = clientId;
        this.guildId = guildId;
        this.prefix = prefix;
        this.useSlashCommands = useSlashCommands;
        this.useMessageCommands = useMessageCommands;

        this.slashCommands = [];
        this.messageCommands = [];
        this.database = null;
        this.defaultIntents = [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ];
        this.intents = [...this.defaultIntents];

        this.client = new Client({
            intents: this.intents,
        });

        this.client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isCommand() || !this.useSlashCommands) return;

            const command = this.slashCommands.find(cmd => cmd.name === interaction.commandName);
            if (command) {
                await command.execute(interaction, this.database);
            }
        });

        this.client.on(Events.MessageCreate, async (message) => {
            if (useMessageCommands) {
                if (!message.author.bot && message.content.startsWith(this.prefix)) {
                    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
                    const commandName = args.shift().toLowerCase();

                    const command = this.messageCommands.find(cmd => cmd.name === commandName);
                    if (command) {
                        try {
                            await command.execute(message);
                        } catch (error) {
                            console.error(`Error executing command ${commandName}:`, error);
                        }
                    }
                }
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

    addIntents(...newIntents) {
        this.intents.push(...newIntents);
        this.client = new Client({ intents: this.intents });
        log("info", `Added intents: ${newIntents.join(', ')}`);
    }

    setPath(type, dirPath) {
        const absolutePath = path.resolve(process.cwd(), dirPath);

        if (!fs.existsSync(absolutePath)) {
            console.error(`Directory not found: ${absolutePath}`);
            return;
        }

        const files = fs.readdirSync(absolutePath);
        for (const file of files) {
            const filePath = path.join(absolutePath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                this.setPath(type, path.join(dirPath, file));
            } else if (file.endsWith('.js')) {
                try {
                    const instance = require(filePath);
                    this.set(type, instance);
                } catch (error) {
                }
            }
        }
    }

    set(type, instance) {
        if (type === 'command') {
            if (instance.name && typeof instance.execute === 'function') {
                if (instance.description) {
                    this.slashCommands.push(instance);
                    log("info", `Added slash command: ${instance.name}`);
                } else {
                    this.messageCommands.push(instance);
                    log("info", `Added message command: ${instance.name}`);
                }
            } else {
                console.error('Invalid command format:', instance);
            }
        } else if (type === 'event') {
            if (typeof instance.register === 'function') {
                instance.register(this);
                log("info", `Added event: ${instance.name}`);
            } else {
                log("err", 'Invalid event format:', instance);
            }
        } else {
            if (this.useMessageCommands) {
                log("err", `Unknown type: ${type}`);
            }
        }
    }

    add(commandOrEvent) {
        if (commandOrEvent.name) {
            if (commandOrEvent.execute) {
                if (commandOrEvent.description) {
                    this.slashCommands.push(commandOrEvent);
                    log("info", `Added slash command: ${commandOrEvent.name}`);
                } else {
                    this.messageCommands.push(commandOrEvent);
                    log("info", `Added message command: ${commandOrEvent.name}`);
                }
            } else if (typeof commandOrEvent.register === 'function') {
                commandOrEvent.register(this);
                log("info", `Added event: ${commandOrEvent.name}`);
            } else {
                log("err", 'Invalid command or event format:', commandOrEvent);
            }
        } else {
            log("err", 'Invalid command or event format:', commandOrEvent);
        }
    }

    async registerSlashCommands() {
        if (!this.useSlashCommands) return;

        const rest = new REST({ version: '9' }).setToken(this.token);
        try {
            log("info", 'Waiting for slash commands registry...');

            const commandsToRegister = this.slashCommands.filter(cmd => cmd.description);

            await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
                body: commandsToRegister,
            });
            log("info", 'Slash commands registered');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }

    async run() {
        if (this.useSlashCommands) {
            await this.registerSlashCommands();
        }
        this.checkForUpdates();
        this.client.login(this.token);
    }
}

module.exports = DiscordEasy;