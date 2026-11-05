'use strict';
const { execSync } = require('child_process');

// NOTE: PSYDB_VERSION is exported by dockerize/setup-env.sh;
// fallback for local dev builds
const getBuildVersion = () => {
    if (process.env.PSYDB_VERSION) {
        return process.env.PSYDB_VERSION;
    }
    try {
        return execSync('git describe --tags --abbrev=0', {
            cwd: __dirname, stdio: [ 'ignore', 'pipe', 'ignore' ]
        }).toString().trim();
    }
    catch (e) {
        return 'unknown';
    }
}

module.exports = getBuildVersion;
