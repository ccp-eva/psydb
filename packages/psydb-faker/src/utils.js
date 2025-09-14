'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');
var { Fields: BaseFields } = require('@mpieva/psydb-custom-fields-faker');

//var fakeval = (systemType, props) => (
//    Fields[systemType].getRandomValue({ definition: { props }});
//)
var Fields = {};
for (let [ systemType, fn ] of Object.entries(BaseFields)) {
    Fields[systemType] = (...args) => {
        var [ props = {}, extra ] = args;

        return BaseFields[systemType].getRandomValue({
            definition: { props }, ...extra
        })
    };
}

var applyOverrides = (bag) => {
    var { record, refcache, overrides = {} } = bag;
    
    if (typeof overrides === 'function') {
        overrides = overrirde({ record, refcache });
    }

    for (var [ pointer, value ] of Object.entries(overrides)) {
        jsonpointer.set(record, pointer, value);
    }
}

module.exports = { Fields, applyOverrides };
