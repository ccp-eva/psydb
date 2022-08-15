'use strict';

var createCRTCollectionStages = async (bag) => {
    var { db, permissions } = bag;

    //var childlabId = 'VVuQ9Z4dp6o5rmhbhMwvQ';
    //allowedResearchGroupIds = [ childlabId ];

    var researchGroupRecords = await (
        db.collection('researchGroup').aggregate([
            { $match: {
                _id: { $in: permissions.getResearchGroupIds() },
            }},
            { $project: {
                'state.recordTypePermissions': true
            }}
        ]).toArray()
    );

    var allowedTypeKeys = [];
    for (var rg of researchGroupRecords) {
        var {
            recordTypePermissions = {}
        } = rg.state;

        for (var target of Object.keys(recordTypePermissions)) {
            var items = recordTypePermissions[target];
            allowedTypeKeys.push(...items.map(it => (
                it.typeKey
            )))
        }
    }

    return [
        { $match: {
            type: { $in: allowedTypeKeys }
        }}
    ];
}

module.exports = createCRTCollectionStages;
