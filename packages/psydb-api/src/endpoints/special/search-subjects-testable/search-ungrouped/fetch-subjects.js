'use strict';
var debug = require('debug')('psydb:api:endpoints:searchSubjectsUngrouped');

var { ejson } = require('@mpieva/psydb-core-utils');
var { withRetracedErrors } = require('@mpieva/psydb-api-lib');
var ensureIndices = require('./ensure-indices');

var fetchSubjects = async (bag) => {
    var { db, stages, subjectTypeKey, dobFieldPointer } = bag;

    await ensureIndices({ db, subjectTypeKey, dobFieldPointer });

    debug('start aggregate');
    var result = await withRetracedErrors(
        db.collection('subject')
        .aggregate(stages, {
            hint: `ageFrameIndex`, // FIXME: mimimi
            //hint: `ageFrameIndex_${subjectTypeKey}`,
            allowDiskUse: true,
        })
        .toArray()
    );
    debug('end aggregate');

    return result;
}

module.exports = fetchSubjects;
