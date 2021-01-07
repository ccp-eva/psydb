'use strict';
var rx = new RegExp(`
    ^
    records\\/
    (?:create|patch)\\/
    (?:
        location\\/(?:building|room)\\/[a-zA-Z]+
        |
        (?!location)(?:[a-zA-Z]+)
        (?:\\/[a-zA-Z]+)?
    )
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = rx;
