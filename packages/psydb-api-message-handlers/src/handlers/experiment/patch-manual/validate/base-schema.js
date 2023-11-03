'use strict';
var enums = require('@mpieva/psydb-schema-enums');

var { OpenObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Message, requireify } = require('@mpieva/psydb-schema-helpers');

var BaseSchema = (handlerType) => {
    var { properties, required } = requireify({
        experimentId: ForeignId({ collection: 'experiment' }),
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
