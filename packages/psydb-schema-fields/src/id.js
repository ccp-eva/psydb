'use strict';
var Id = ({
    isNullable,
    ...additionalKeywords
} = {}) => {
    
    var base = {
        systemType: 'Id',
        type: (
            isNullable
            ? ['null', 'string']
            : 'string'
        ),
        format: 'nanoid-default',
        //format: 'mongodb-object-id',
        //unmarshalMongodbObjectId: true,
    };

    if (isNullable) {
        base.default = null;
    }

    return {
        ...base,
        ...additionalKeywords,
    }
};

module.exports = Id;
