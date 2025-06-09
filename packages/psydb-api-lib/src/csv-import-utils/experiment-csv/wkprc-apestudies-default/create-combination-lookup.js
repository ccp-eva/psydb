'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { keyRecords } = require('@mpieva/psydb-common-lib');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');

var createCombinedLookup = async (bag) => {
    var { db, parsed, subjectType } = bag;

    var subjectValues = [];
    for (var p of parsed) {
        var { isValid, obj } = p;
        
        if (!isValid) {
            continue;
        }

        var { subjectData } = obj;

        for (var d of subjectData) {
            var { subjectId } = d;
            subjectValues.push(subjectId)
        }
    }

    var subjectRecords = await aggregateToArray({ db, subject: [
        { $match: {
            'type': subjectType,
            'scientific.state.custom.name': { $in: subjectValues }
        }},
        { $project: {
            '_id': true,
            'subjectGroupId': '$scientific.state.custom.groupId',
            'locationId': '$scientific.state.custom.locationId',
            'subjectName': '$scientific.state.custom.name',
        }}
    ]});

    var locationRecords = await aggregateToArray({ db, location: [
        { $match: {
            '_id': { $in: subjectRecords.map(it => it.locationId) }
        }},
        { $project: {
            '_id': true,
            'locationName': '$state.custom.name',
            '__locationType': '$type', // FIXME
        }}
    ]});
    
    var subjectGroupRecords = await aggregateToArray({ db, subjectGroup: [
        { $match: {
            '_id': { $in: subjectRecords.map(it => it.subjectGroupId) }
        }},
        { $project: {
            '_id': true,
            'subjectGroupName': '$state.name',
        }}
    ]});


    var locationsById = keyRecords(locationRecords);
    var subjectGroupsById = keyRecords(subjectGroupRecords);

    var out = [];
    for (var it of subjectRecords) {
        var { locationId, subjectGroupId } = it;

        var locationRecord = locationsById[locationId];
        var subjectGroupRecord = subjectGroupsById[subjectGroupId];

        out.push({ ...locationRecord, ...subjectGroupRecord, ...it });
    }

    return out;
}

module.exports = createCombinedLookup;
