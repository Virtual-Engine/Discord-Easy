const base_command = require('../base');

class message_command extends base_command {
    constructor(name, executeFn) {
        super(name, executeFn);
    }

    register(bot) {
        bot.messageCommands.push(this);
        console.log(`Message Command "${this.name}" added`);
    }
}

module.exports = message_command;
