'use strict';
var fspath = require('path');
var co = require('co');

var cli = require('./setup-cli');
var cwd = process.cwd();

var handleCollectionConfig = require('./handle-collection-config');
var handleCustomDumpFN = require('./handle-custom-dump-fn');

co(async () => {
    var now = new Date();
    var { config: configPath, outPath } = cli.opts();

    var fullConfigPath = fspath.resolve(fspath.join(cwd, configPath));
    var fullOutPath = fspath.resolve(fspath.join(cwd, outPath));

    var {
        url,
        collections: collectionConfig,
        customDumpFN
    } = require(fullConfigPath);

    if (customDumpFN) {
        await handleCustomDumpFN({ url, customDumpFN, fullOutPath });
    }
    else if (collectionConfig) {
        await handleCollectionConfig({ url, collectionConfig, fullOutPath });
    }
    else {
        throw new Error('Set either "collection" or "customDumpFN"!');
    }

}).catch(error => { console.log(error) });
