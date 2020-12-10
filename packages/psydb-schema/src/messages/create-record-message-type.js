'use strict';

var createRecordMessageType = ({ op, collection, type, subtype }) => {
    return [
        `/records/${op}/${collection}`,
        ...(type ? [type] : []),
        ...(subtype ? [subtype] : []),
    ].join('/');
};

module.exports = createRecordMessageType; 
