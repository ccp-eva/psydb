'use strict';
var { without } = require('@mpieva/psydb-core-utils');

var fetchCollections = async (bag) => {
    var {
        db,
        onlyCollections,
        skippedCollections = [],
        priorityCollections = []
    } = bag;
    
    var filter = (
        onlyCollections
        ? { name: { $in: without(onlyCollections, skippedCollections) }}
        : { name: { $nin: skippedCollections }}
    );

    var allCollections = await (
        db
        //.listCollections({ name: { $in: [ 'user', 'announcement' ]}})
        .listCollections(filter)
        .withReadPreference('primary')
        .map(it => it.name)
        .toArray()
    );

    allCollections.sort((a, b) => {
        var ixA = priorityCollections.indexOf(a);
        var ixB = priorityCollections.indexOf(b);

        if (ixA === -1 && ixB > -1) {
            return 1;
        }
        else if (ixB === -1 && ixA > -1) {
            return -1;
        }
        else if (ixA > -1 && ixB > -1) {
            return ixA - ixB;
        }
        else {
            a.localeCompare(b)
        }
    });

    return allCollections;
}

module.exports = fetchCollections;
