'use strict';
var EventId = ({
    additionalKeywords,
    ...other
} = {}) => ({
    type: 'string',
    format: 'nanoid-default',
    //format: 'mongodb-object-id',
    //unmarshalMongodbObjectId: true,
    ...additionalKeywords,
});

module.exports = EventId;
