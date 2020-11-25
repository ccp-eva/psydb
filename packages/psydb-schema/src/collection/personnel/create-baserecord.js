'use strict';
var {
    ForeignId
} = require('@mpieva/psydb-schema-fields');

var prefix = require('./schema-id-prefix');

var createPersonnelBaseRecord = () => {
    var schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: `${prefix}//baserecord`,
        type: 'object',
        properties: {
            role: { enum: [
                'admin',
                'ra',
                'scientist',
                'experimenter',
                'call-agent',
                'reception',
            ]},
            belongsToInstituteIds: {
                type: 'array',
                items: ForeignId('institute')
            }
        },
        required: [
            'type',
            'name',
        ]
    };

    return schema;
}

module.exports = createGenericLocationBaseRecord;
