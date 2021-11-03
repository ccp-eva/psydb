'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareSubjectRecord = async (context, options) => {
    var { db, cache } = context;
    var { subjectId } = options;
    
    var subjectRecord = await (
        db.collection('subject').findOne({
            _id: subjectId
        }, { projection: { events: false }})
    );
    if (!subjectRecord) {
        throw new ApiError(400, 'InvalidSubjectId');
    }

    cache.subjectRecord = subjectRecord;
}

module.exports = prepareSubjectRecord;
