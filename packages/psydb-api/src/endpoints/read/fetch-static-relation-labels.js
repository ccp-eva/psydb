'use strict';

var fetchStaticRelationLabels = async ({
    db,
    collectionName,
    record
}) => {
    switch (collectioName) {
        case 'subject':
            return await fetchSubjectRelationLabels({
                db, record
            });
        default: 
            return {};
    }
}

var fetchSubjectRelationLabels = async ({ db, record }) => {
    var {
        testingPermissions,
        systemPermissions
    } = record.state;

    var systemPermissionLabels = fetchSystemPermissionLabels({
        db, record
    });

    var related = {
        ...systemPermissionLabels
    }
}
