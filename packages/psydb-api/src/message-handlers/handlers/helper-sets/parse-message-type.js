'use strict';
var rx = new RegExp(`
    ^
    helper-sets\\/
    (create|patch)
    $
`.replace(/\s*\n\s*/g, ''))

var parseMessageType = (type) => {
    var match = type.match(rx);

    return { 
        op: match[1],
    };
}

module.exports = parseMessageType;
