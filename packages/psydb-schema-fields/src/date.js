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

var MongoDate = require('@mpieva/psydb-schema-primitives').MongoDateRelaxed;

// TODO: figure out if we want that to be called "Date" bc reserved
// TODO: figure out if its better to use mongo-extjson or not
// we could use json and convert stuff based on its format
// might be less code that fiddling with ui
var Date = ({
    additionalKeywords,
    ...other,
}) => (
    MongoDate({
        ...other,
        additionalKeywords: {
            ...additionalKeywords,
            'ui:widget': 'mongo-date'
        }
    })
);

module.exports = Date;

