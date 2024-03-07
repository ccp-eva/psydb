'use strict';
var apiConfig = require('@mpieva/psydb-api-config');

var priorityCollections = [
    'personnel',
    'customRecordTypes',
    'helperSet',
    'helperSetItem',
];

var onlyCollections = undefined;

var skippedCollections = [
    'mqMessageQueue',
    'mqMessageHistory',
    'erroneousMessages',
    'rohrpostEvents',
]

var collectionsToCache = [
    ...priorityCollections,
];

var dumperconfig = {
    ...apiConfig.mongodb,
    priorityCollections,
    onlyCollections,
    skippedCollections,
    collectionsToCache
}

module.exports = dumperconfig;

