'use strict';
var MessageTypeRegex = (op) => new RegExp(`
    ^
    records\\/
    ${op}\\/
    (?:
        (?:[a-zA-Z]+)
        (?:\\/[a-zA-Z]+)?
    )
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = MessageTypeRegex;
