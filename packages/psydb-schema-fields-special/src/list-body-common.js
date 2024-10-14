'use strict';
var {
    MaxObject, IdList, DefaultBool, StringEnum,
} = require('@mpieva/psydb-schema-fields');

var ListBodyCommon = () => {
    var schema = MaxObject({
        target: StringEnum([ 'table', 'optionlist' ]),
        showHidden: DefaultBool(),
        excludedIds: IdList(),
        extraIds: IdList(),
    });

    return schema;
}

module.exports = ListBodyCommon;
