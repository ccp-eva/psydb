'use strict';
// FIXME:
// we need to make sure we emulate the upcoming v3.0 behavior
// mongo extjson in regards to datetime i.e.: always use iso string
// see:
// https://github.com/mongodb/specifications/blob/master/source/extended-json.rst#datetime
// extjson.stringify(
//     { foo: new Date('1600-01-01') },
//     (a, o) => { 
//         if (a === '$date') {
//              return (new Date(parseInt(o['$numberLong']))).toISOString()
//         }
//         else {
//             return o; 
//         }
//     },
//     { relaxed: true }
// )
module.exports = (
    require('@mpieva/psydb-schema-primitives').MongoDateRelaxed
);

