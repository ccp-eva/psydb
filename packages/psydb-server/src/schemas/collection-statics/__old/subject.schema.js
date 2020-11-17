{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "psy-db/subject.schema.json",
    "allOf": [
        {
            "type": "object",
            "properties": {
                "_id": { "$ref": "prmitives/mongo-oid.json#" },
                "type": {
                    "type": "string"
                }
            }
        },
        { 
            "oneOf": [
                { "$ref": "./subject-human.schema.json" },
                { "$ref": "./subject-animal.schema.json" }
            ]
        }
    ]
}
