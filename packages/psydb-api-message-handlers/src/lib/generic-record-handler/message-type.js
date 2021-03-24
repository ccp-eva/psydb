'use strict';
var MessageTypeRegex = ({ collection, op }) => new RegExp(`
    ^
    ${collection}\\/
    (?:[a-zA-Z]+\\/)?
    ${op}
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = MessageTypeRegex;
