'use strict';
var MongoDateRelaxed = ({
    formatMinimum
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
    ]
})

module.exports = MongoDateRelaxed
