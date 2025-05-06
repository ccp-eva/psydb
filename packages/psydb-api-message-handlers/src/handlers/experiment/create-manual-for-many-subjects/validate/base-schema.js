'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var { OpenObject, StringEnum } = require('@mpieva/psydb-schema-fields');
var { Message, requireify } = require('@mpieva/psydb-schema-helpers');

var BaseSchema = (handlerType) => {
    var { properties, required } = requireify({
        labMethod: StringEnum([
            //'apestudies-wkprc-default', // XXX currently disabled
            'manual-only-participation',
            'online-survey'
        ]),
    });
    
    return Message({
        type: handlerType,
        payload: OpenObject({
            properties,
            required,
        })
    });
}

module.exports = { BaseSchema };
