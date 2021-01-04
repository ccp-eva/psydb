'use strict';
var rx = new RegExp(`
    ^
    helper\-set\-items\\/
    (create|patch)\\/
    ([a-zA-Z]+)
    $
`.replace(/\s*\n\s*/g, ''))

var parseMessageType = (type) => {
    var match = type.match(rx);

    return { 
        op: match[1],
        set: match[2],
    };
}

module.exports = parseMessageType;
