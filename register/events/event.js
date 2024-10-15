
class events {
    constructor(name, executeFn) {
        this.name = name;
        this.execute = executeFn;
    }

    register(bot) {
        bot.client.on(this.name, async (...args) => {
            try {
                await this.execute(...args);
            } catch (error) {
                console.error(`Error in event handler for ${this.name}:`, error);
            }
        });
        console.log(`Event "${this.name}" added`);
    }
}

module.exports = events;
