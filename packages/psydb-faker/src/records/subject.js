'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields, applyOverrides } = require('../utils');

var fakeRecord = (bag) => {
    var { crtSettings, refcache, overrides } = bag;
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

    applyOverrides({ record, refcache, overrides });

    return record;
}

module.exports = fakeRecord;
