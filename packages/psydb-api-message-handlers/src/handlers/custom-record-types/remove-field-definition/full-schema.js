'use strict';
var { ClosedObject, ForeignId, IdentifierString, SubChannelKey}
    = require('@mpieva/psydb-schema-fields');

var FullSchema = (bag) => {
    var { hasSubChannels } = bag;

    var schema = ClosedObject({
        'id': ForeignId({ collection: 'customRecordType' }),
        'key': IdentifierString(),
        ...(hasSubChannels && {
            'subChannelKey': SubChannelKey(),
        })
    });
    
    return schema;
}

module.exports = FullSchema;
