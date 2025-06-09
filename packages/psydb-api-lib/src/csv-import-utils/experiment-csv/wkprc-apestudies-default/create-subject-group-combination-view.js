'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { keyRecords } = require('@mpieva/psydb-common-lib');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var createSubjectGroupCombinationView = async (bag) => {
    var { db, parsed, subjectType } = bag;

    var subjectGroupValues = [];
    for (var p of parsed) {
        var { isValid, obj } = p;
        
        if (!isValid) {
            continue;
        }

        var { subjectGroupId } = obj;
        subjectGroupValues.push(subjectGroupId);
    }

    var subjectGroupRecords = await aggregateToArray({ db, subjectGroup: [
        { $match: {
            'subjectType': subjectType,
            'state.name': { $in: subjectGroupValues }
        }},
        { $project: {
            '_id': true,
            'subjectGroupName': '$state.name',
            'locationId': '$state.locationId',
        }}
    ]});

    var locationRecords = await aggregateToArray({ db, location: [
        { $match: {
            '_id': { $in: (
                subjectGroupRecords.map(it => it.locationId)
            )},
        }},
        { $project: {
            '_id': true,
            'locationName': '$state.custom.name',
            '__locationType': '$type', // FIXME
        }}
    ]});
    

    var locationsById = keyRecords(locationRecords);

    var out = [];
    for (var it of subjectGroupRecords) {
        var { locationId } = it;
        var locationRecord = locationsById[locationId];

        out.push({ ...locationRecord, ...it });
    }

    return out;
}

module.exports = createSubjectGroupCombinationView;
