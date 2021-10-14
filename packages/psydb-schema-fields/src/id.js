'use strict';
var Id = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    
    var type = (
        isNullable
        ? ['null', 'string']
        : 'string'
    );

    return {
        systemType: 'Id',
        type,
        format: 'nanoid-default',
        //format: 'mongodb-object-id',
        //unmarshalMongodbObjectId: true,
        ...additionalKeywords,
    }
};

module.exports = Id;
