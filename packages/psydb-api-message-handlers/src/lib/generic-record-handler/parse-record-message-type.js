'use strict';
var rx = new RegExp(`
    ^
    ([a-zA-Z]+)\\/
    (?:([a-zA-Z]+)\\/)?
    (create|patch)
    $
`.replace(/\s*\n\s*/g, ''))

var parseRecordMessageType = (type) => {
    var match = type.match(rx);

    return { 
        collection: match[1],
        recordType: match[2],
        op: match[3],
    };
}

module.exports = parseRecordMessageType;
