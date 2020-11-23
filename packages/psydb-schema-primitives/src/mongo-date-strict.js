'use strict';
var MongoDateStrict = () => ({
    type: "object",
    properties: {
        $date: {
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
        }
    },
    required: [
        "$date"
    ]
})

module.exports = MongoDateStrict;
