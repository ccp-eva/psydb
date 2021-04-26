'use strict';

var resolveRelationData = require('./resolve-relation-data');
var fetchRelatedRecords = require('./fetch-related-records');
var fetchRelatedHelperSetItems = require('./fetch-related-helper-set-items');

var fetchRelatedLabels = async ({
    db,
    schema,
    data,
}) => {
    
    var {
        helperSetItemIdRelationData,
        foreignIdRelationData
    } = resolveRelationData({
        schema,
        data,
    });

    //console.dir(schema, { depth: null });
    //console.dir(data, { depth: null });
    //console.dir(helperSetItemIdRelationData, { depth: null });
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

    return ({
        relatedRecords,
        relatedHelperSetItems,
        /*relatedHelperSetItems: keyBy({
            items: relatedHelperSetItems.map(it => ({
                _id: it._id,
                label: it.state.label
            }))
        }),*/
    });
}

module.exports = fetchRelatedLabels;
