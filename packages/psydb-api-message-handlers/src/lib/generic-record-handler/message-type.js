'use strict';
var MessageTypeRegex = ({ collection, op }) => new RegExp(`
    ^
    ${collection}\\/
    (?:[a-zA-Z0-9_]+\\/)?
    ${op}
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = MessageTypeRegex;
