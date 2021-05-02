'use strict';

var resolveRelationData = require('./resolve-relation-data');
var fetchRelatedRecords = require('./fetch-related-records');
var fetchRelatedHelperSetItems = require('./fetch-related-helper-set-items');
var fetchRelatedCustomRecordTypes = require('./fetch-related-custom-record-types');

var fetchRelatedLabels = async ({
    db,
    schema,
    data,
}) => {
    
    var {
        helperSetItemIdRelationData,
        foreignIdRelationData,
        customRecordTypeRelationData,
    } = resolveRelationData({
        schema,
        data,
    });

    //console.dir(schema, { depth: null });
    //console.dir(data, { depth: null });
    //console.dir(foreignIdRelationData, { depth: null });
    //console.dir(helperSetItemIdRelationData, { depth: null });
    //console.dir(customRecordTypeRelationData, { depth: null });
    //throw new Error();

    var relatedRecords = await fetchRelatedRecords({
        db,
        foreignIdRelationData,
        labelOnly: true,
    });

    var relatedHelperSetItems = await fetchRelatedHelperSetItems({
        db,
        helperSetItemIdRelationData,
    });

    var relatedCustomRecordTypes = await fetchRelatedCustomRecordTypes({
        db,
        customRecordTypeRelationData,
        labelOnly: true
    });

    return ({
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
        /*relatedHelperSetItems: keyBy({
            items: relatedHelperSetItems.map(it => ({
                _id: it._id,
                label: it.state.label
            }))
        }),*/
    });
}

module.exports = fetchRelatedLabels;
