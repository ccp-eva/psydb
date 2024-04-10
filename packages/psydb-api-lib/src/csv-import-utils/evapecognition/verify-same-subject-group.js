'use strict';
var { keyBy, compareIds } = require('@mpieva/psydb-core-utils');
var withRetracedErrors = require('../../with-retraced-errors');
var aggregateToArray = require('../../aggregate-to-array');

var { CSVImportError } = require('../errors');


var verifySameSubjectGroup = async (bag) => {
    var { db, preparedObjects } = bag;
    
    var subjectIds = [];
    for (var it of preparedObjects) {
        var { subjectData } = it;
        subjectIds.push(...subjectData.map(it => it.subjectId))
    }
    
    var records = await withRetracedErrors(
        aggregateToArray({ db, subject: [
            { $match: { _id: { $in: subjectIds }}},
            { $project: {
                'groupId': '$scientific.state.custom.groupId', // XXX
            }}
        ]})
    );

    var groupIdsBySubject = keyBy({
        items: records,
        byProp: '_id',
        transform: (it => it.groupId)
    });

    var invalid = [];
    for (var [ oix, obj ] of preparedObjects.entries()) {
        var { subjectData } = obj;
        var groupId = undefined;
        for (var it of subjectData) {
            var itemGroupId = groupIdsBySubject[it.subjectId];
            if (groupId && !compareIds(groupId, itemGroupId)) {
                invalid.push({ ix: oix, item: obj });
            }
            else {
                groupId = itemGroupId;
            }
        }

        // FIXME: i dont like that
        obj.subjectGroupId = groupId;
    }

    if (invalid.length > 0) {
        throw new CSVImportError('TODO', {}); // TODO
    }
}

module.exports = verifySameSubjectGroup;
