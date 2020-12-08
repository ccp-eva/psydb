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

var MongoDateRelaxed = ({
    formatMinimum,
    additionalKeywords,
} = {}) => ({
    type: "object",
    properties: {
        $date: {
            type: "string",
            format: "date-time",
            examples: [
                "2020-01-01T08:45:00.000Z",
                "2020-01-01T08:45:00.000+02:00",
            ],
            ...( formatMinimum !== undefined ? formatMinimum : {}),
        }
    },
    required: [
        "$date"
    ],
    ...additionalKeywords,
})

module.exports = MongoDateRelaxed
