class base_command {
    constructor(name, executeFn) {
        this.name = name;
        this.execute = executeFn;
    }

    register(bot) {
        throw new Error('La méthode `register()` doit être implémentée dans la sous-classe.');
    }
}

module.exports = base_command;
