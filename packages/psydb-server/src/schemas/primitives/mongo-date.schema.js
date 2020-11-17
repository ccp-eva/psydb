'use strict';
var id = "psy-db/primitives/mongo-date.schema.js",
    ref = { $ref: `${id}#` };

var strictVariant = {
    type: "object",
    properties: {
        $numberLong: {
            type: "string",
            examples: [
                "1507892742363",
                "1507892860454",
                "1507892872648"
            ]
        }
    },
    required: [
        "$numberLong"
    ]
};

var relaxedVariant = {
    type: "string",
    format: "date-time",
    examples: [
        "2020-01-01T08:45:00.000Z",
        "2020-01-01T08:45:00.000+02:00",
    ]
};

var schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: id,
    type: "object",
    properties: {
        $date: {
            oneOf: [
                strictVariant,
                relaxedVariant,
            ]
        }
    },
    required: [
        "$date"
    ]
}

module.exports = {
    id,
    ref,
    schema
};
