'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');
var {
    noop, // FIXME: move to api-lib
    verifyOneRecord
} = require('@mpieva/psydb-api-message-handler-lib');

var verifyTeamOrOperators = async (context, next = noop) => {
    var { labTeamId } = context.message.payload;
    if (labTeamId) {
        await verifyLabTeam(context);
    }
    else {
        await verifyLabOperators(context);
    }
}

var verifySubjects = async (context, next = noop) => {
    var { db, message, cache } = context;
    var { subjectData } = message.payload;

    var subjectIds = subjectData.map(it => it.subjectId);
    var subjects = await (
        db.collection('subject')
        .find({ _id: { $in: subjectIds }})
        .toArray()
    );
    // TODO: check subject permissions agains study permissions
    // TODO: check subject record type agains study subject types
    if (subjects.length !== subjectIds.length) {
        throw new ApiError(409, {
            apiStatus: 'MessageDataConflict',
            data: { pointer: '/payload/subjectData/subjectId' }
        });
    }
    
    cache.merge({ subjects });
    await next();
}

var verifyLabOperators = async (context, next = noop) => {
    var { db, message, cache } = context;
    var { labOperatorIds } = message.payload;
            
    var labOperators = await (
        db.collection('personnel')
        .find({ _id: { $in: labOperatorIds } })
        .toArray()
    );
    
    if (labOperators.length !== labOperatorIds.length) {
        throw new ApiError(409, {
            apiStatus: 'MessageDataConflict',
            data: { pointer: '/payload/labOperatorIds' }
        });
    }
    
    cache.merge({ labOperators });
    await next();
} 

var verifyStudy = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true
});

var verifyLocation = verifyOneRecord({
    collection: 'location',
    by: '/payload/locationId',
    cache: true
});

var verifySubjectGroup = verifyOneRecord({
    collection: 'subjectGroup',
    by: '/payload/subjectGroupId',
    cache: true
});

var verifyLabTeam = verifyOneRecord({
    collection: 'experimentOperatorTeam',
    by: '/payload/labTeamId',
    cache: true,
    as: 'labTeam'
});

module.exports = {
    verifyStudy,
    verifySubjects,
    verifyLocation,
    verifySubjectGroup,
    verifyTeamOrOperators,
}
