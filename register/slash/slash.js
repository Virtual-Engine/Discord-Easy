const base_command = require('../base');

class slash_command extends base_command {
    constructor(name, description, executeFn) {
        super(name, executeFn);
        this.description = description;
    }

    // La méthode spécifique pour enregistrer une commande de type slash
    register(bot) {
        bot.slashCommands.push({
            name: this.name,
            description: this.description,
            execute: this.execute
        });
        console.log(`Slash Command "${this.name}" added`);
    }
}

module.exports = slash_command;
