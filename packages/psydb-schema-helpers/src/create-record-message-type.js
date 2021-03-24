'use strict';

var createRecordMessageType = ({ op, collection, type, subtype }) => {
    /*return [
        `records/${op}/${collection}`,
        ...(type ? [type] : []),
        ...(subtype ? [subtype] : []),
    ].join('/');*/
    return [
        collection,
        ...(type ? [type] : []),
        op
    ].join('/');
};

module.exports = createRecordMessageType; 
