'use strict';
var { keyBy } = require('@mpieva/psydb-core-utils');
var allSchemaCreators = require('@mpieva/psydb-schema-creators');

var gatherStaticDisplayFields = async (bag) => {
    var { db, collection, target } = bag;
    
    var collectionCreatorData = allSchemaCreators[collection];
    var {
        //hasSubChannels,
        availableStaticDisplayFields = [],
        staticDisplayFields,
        staticOptionListDisplayFields,
    } = collectionCreatorData;

    var displayFields = undefined;
    if (target === 'optionlist') {
        displayFields = (
            staticOptionListDisplayFields
            || staticDisplayFields
            || []
        );
    } else {
        displayFields = staticDisplayFields || [];
    }
    var availableDisplayFieldDataByPointer = keyBy({
        items: availableStaticDisplayFields,
        byProp: 'dataPointer'
    });

    var mergedDisplayFieldData = (
        displayFields
        .filter(it => (
            !!availableDisplayFieldDataByPointer[it.dataPointer]
        ))
        .map(it => ({
            ...availableDisplayFieldDataByPointer[it.dataPointer],
            dataPointer: it.dataPointer,
            pointer: it.dataPointer,
        })
    ))
    
    return mergedDisplayFieldData;
}

module.exports = gatherStaticDisplayFields;
