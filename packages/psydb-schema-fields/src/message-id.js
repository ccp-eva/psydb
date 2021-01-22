'use strict';
var MessageId = ({
    additionalKeywords,
    ...other
} = {}) => ({
    type: 'string',
    format: 'nanoid-default',
    //format: 'mongodb-object-id',
    //unmarshalMongodbObjectId: true,
    ...additionalKeywords,
});

module.exports = MessageId;
