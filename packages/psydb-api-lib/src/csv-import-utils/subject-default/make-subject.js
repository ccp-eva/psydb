'use strict';
var { copy } = require('copy-anything');
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('@mpieva/psydb-mongo-adapter');

var makeSubject = (bag) => {
    var {
        preparedObject,

        subjectCRT,
        researchGroupId,
        timezone
    } = bag;

    var subjectId = ObjectId();
    var subjectCore = {
        type: subjectCRT.getType(),
        csvImportId: null,
    }

    // FIXME: check ObjectIds/Dates
    var gdprState = copy(preparedObject.gdpr?.state || {});
    var scientificState = copy(preparedObject.scientific?.state || {});

    jsonpointer.set(
        scientificState,
        '/internals/systemPermissions/accessRightsByResearchGroup/0',
        { researchGroupId, permission: 'write' }
    );

    //jsonpointer.set(
    //    scientificState,
    //    '/internals/testingPermissionsPermissions/0/researchGroupId',
    //    researchGroupId
    //);

    return {
        record: {
            _id: subjectId,
            ...subjectCore,
            gdpr: { state: gdprState },
            scientific: { state: scientificState },
        },
        parts: {
            _id: subjectId,
            core: subjectCore,
            gdprState,
            scientificState,
        }
    }
}
