'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Study } = require('@mpieva/psydb-schema-creators');

var Schema = (bag) => {
    var { apiConfig, crtSettings } = bag;

    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'study' }),
        'props': Study.State({
            apiConfig,
            customFieldDefinitions: crtSettings.allCustomFields()
        }),
    });
    
    return schema;
}

module.exports = Schema;
