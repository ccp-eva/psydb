'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields, applyOverrides } = require('../utils');

var fakeRecord = (bag) => {
    var { crtSettings, refcache, overrides } = bag;
    var { fieldDefinitions, requiresTestingPermissions } = crtSettings;

    var systemPermissions = Fields.SystemPermissions({}, {
        fromStore: refcache,
    });

    var record = {
        'gdpr': { 'state': {
            'custom': {},
        }},
        'scientific': { 'state': {
            'custom': {},
            'systemPermissions': systemPermissions,
            ...(requiresTestingPermissions && {
                'testingPermissions': fakeTestingPermissions({
                    systemPermissions
                }),
            }),
            'comment': '',
        }},
    }

    // NOTE: subject field definitions are keyed by sub channel
    var allDefinitions = Object.values(fieldDefinitions).flat();
    for (var def of allDefinitions) {
        var { pointer, type, systemType, props } = def;
        if (props.readOnly) {
            continue; // NOTE: api rejects values for read only fields
        }
        if (!systemType) { // FIXME
            systemType = type;
        }

        jsonpointer.set(record, pointer, Fields[systemType](props, {
            fromStore: refcache
        }))
    }

    applyOverrides({ record, refcache, overrides });

    return record;
}

var fakeTestingPermissions = (bag) => {
    var { systemPermissions } = bag;
    var { accessRightsByResearchGroup } = systemPermissions;

    // TODO: respect the lab methods of the research group
    return accessRightsByResearchGroup.map(({ researchGroupId }) => ({
        researchGroupId,
        permissionList: [ 'inhouse', 'away-team' ].map(key => ({
            labProcedureTypeKey: key,
            value: Fields.ExtBool(),
        }))
    }));
}

module.exports = fakeRecord;
