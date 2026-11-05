'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields, applyOverrides } = require('../utils');

var fakeRecord = (bag) => {
    var { crtSettings, refcache, overrides } = bag;
    var { fieldDefinitions } = crtSettings;

    var record = { 'state': {
        'custom': {},
        'systemPermissions': Fields.SystemPermissions({}, {
            fromStore: refcache,
        }),
    }}

    for (var def of fieldDefinitions) {
        var { pointer, type, systemType, props } = def;
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

module.exports = fakeRecord;
