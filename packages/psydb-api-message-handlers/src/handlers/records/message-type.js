'use strict';
var rx = new RegExp(`
    ^
    records\\/
    (?:create|patch)\\/
    (?:
        (?:[a-zA-Z]+)
        (?:\\/[a-zA-Z]+)?
    )
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = rx;
