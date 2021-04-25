'use strict';

var resolveRelationData = require('./resolve-relation-data');
var fetchRelatedRecords = require('./')

var fetchRelatedLabels = async ({
    db,
    schema
    data,
}) => {
    
    var {
        helperSetItemIdRelationData,
        foreignIdRelationData
    } = resolveRelationData({
        schema,
        data,
    });

    var relatedRecord = await fetchRelatedRecords({
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
        relatedHelperSetItems,
        /*relatedHelperSetItems: keyBy({
            items: relatedHelperSetItems.map(it => ({
                _id: it._id,
                label: it.state.label
            }))
        }),*/
    });
}

module.exports = fetchRelatedlabels;
