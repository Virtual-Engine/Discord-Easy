const axios = require('axios');
const { version: currentVersion } = require('./package.json');

async function checkForUpdates() {
    const response = await axios.get(`https://registry.npmjs.org/discord-easy`);
    const latestVersion = response.data['dist-tags'].latest;

    if (latestVersion !== currentVersion) {
        console.log(`[discord-easy] Update available ${currentVersion} → ${latestVersion} : npm i discord-easy@latest`);
    }
}


module.exports = checkForUpdates;