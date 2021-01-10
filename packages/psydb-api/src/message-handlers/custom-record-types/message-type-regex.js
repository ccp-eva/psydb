'use strict';
//
// /location/gps
// /location/building/school
// /location/room/classroom
// /subject/teacher
//
var rx = new RegExp(`
    ^
    custom\\-record\\-types\\/
    (?:create|patch)\\/
    (?:
        location\\/[]
        location\\/[a-zA-Z]+(?:\\/[a-zA-Z]+)?
        |
        (?!location)[a-zA-Z]+\\/
    )
    $
`.replace(/\s*\n\s*/g, ''))

module.exports = rx;
