'use strict';

var resolveRelationData = require('./resolve-relation-data');
var fetchRelatedRecords = require('./fetch-related-records');

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

    var relatedRecords = await fetchRelatedRecords({
        db,
        foreignIdRelationData,
        labelOnly: true,
    });

    /*var relatedHelperSetItems = await fetchRelatedHelperSetItems({
        db,
        helperSetItemRelationData,
    });*/

    return ({
        relatedRecords,
        //relatedHelperSetItems,
        /*relatedHelperSetItems: keyBy({
            items: relatedHelperSetItems.map(it => ({
                _id: it._id,
                label: it.state.label
            }))
        }),*/
    });
}

module.exports = fetchRelatedLabels;
