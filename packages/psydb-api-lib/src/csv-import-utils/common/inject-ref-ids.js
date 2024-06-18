'use strict';
var gatherPossibleRefs = require('./gather-possible-refs');
var createRefMappings = require('./create-ref-mappings');
var resolveRefs = require('./resolve-refs');
var replaceRefsByMapping = require('./replace-refs-by-mapping');

var injectRefIds = async (bag) => {
    var { db, schema, into: items, extraRecordResolvePointers } = bag;

    var refData = gatherPossibleRefs({ schema });
    var refMappings = createRefMappings({ refData, items });

    var { resolvedRecords, resolvedHSIs } = await resolveRefs({
        db, tokenMapping: refMappings,
        extraRecordResolvePointers,
    });

    var replacementData = replaceRefsByMapping({
        inItems: items,
        refMappings, resolvedRecords, resolvedHSIs
    });

    return replacementData;
}

module.exports = injectRefIds;
