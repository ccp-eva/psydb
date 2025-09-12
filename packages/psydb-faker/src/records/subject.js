'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var fakeRecord = (bag) => {
    var { crtSettings, refcache } = bag;
    var { fieldDefinitions, requiresTestingPermissions } = crtSettings;

    var record = { 
        'gdpr': { 'state': {
            'custom': {},
        }},
        'scientific': { 'state': {
            'custom': {},'
            'systemPermissions': Fields.SystemPermissions({
                fromStore: refcache,
            }),
            ...(requiresTestingPermissions && {
                'testingPermissions': Fields.TestingPermissions(),
            })
        }},
    }

    for (var def of fieldDefinitions) {
        var { pointer, systemType, props } = def;

        jsonpointer.set(record, pointer, Fields[systemType](props, {
            fromStore: refcache
        }))
    }

    return record;
}

module.exports = fakeRecord;
