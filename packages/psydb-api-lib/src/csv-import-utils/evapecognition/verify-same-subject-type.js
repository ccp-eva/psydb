'use strict';
var withRetracedErrors = require('../../with-retraced-errors');
var aggregateToArray = require('../../aggregate-to-array');

var { CSVImportError } = require('../errors');


var verifySameSubjectType = async (bag) => {
    var { db, subjectType, preparedObjects } = bag;

    var subjectIds = [];
    for (var it of preparedObjects) {
        var { subjectData } = it;
        subjectIds.push(...subjectData.map(it => it.subjectId))
    }

    var invalid = await withRetracedErrors(
        aggregateToArray({ db, subject: [
            { $match: {
                _id: { $in: subjectIds },
                type: { $ne: subjectType }
            }},
            { $project: { _id: true }}
        ]})
    );
    if (invalid.length > 0) {
        throw new CSVImportError('TODO', {}); // TODO
    }
}

module.exports = verifySameSubjectType;
