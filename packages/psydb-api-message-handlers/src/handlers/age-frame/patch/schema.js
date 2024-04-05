'use strict';
var {
    ClosedObject,
    DefaultBool,
    ForeignId,
    CustomRecordTypeKey,
} = require('@mpieva/psydb-schema-fields');

var { ageFrame } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        id: ForeignId({ collection: 'ageFrame' }),
        props: ageFrame.State(),
    });
    
    return schema;
}

module.exports = Schema;
