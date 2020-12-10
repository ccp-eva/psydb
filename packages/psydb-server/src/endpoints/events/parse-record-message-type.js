'use strict';
var rx = new RegExp(`
    ^
    records\\/
    (create|patch|deleteGdpr)\\/
    ((?:_helper_)?[a-zA-Z]+)
    (?:\\/([a-zA-Z]+))?
    (?:\\/([a-zA-Z]+))?
    $
`.replace(/\s*\n\s*/g, ''))

var parseRecordMessageType = (type) => {
    var match = type.match(rx);

    return { 
        op: match[1],
        collection: match[2],
        recordType: match[3],
        recordSubtype: match[4],
    };
}

module.exports = parseRecordMessageType;
