{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "psy-db/subject-human.schema.json",
    "type": "object",
    "properties": {
        "type": { "const": "human" },
        "scientific": {
            "allOf": [
                {
                    "type": "object",
                    "properties": {
                        "dateOfBirth": {
                            "$ref": "primitives/mongo-date.json#"
                        }
                    }
                },
                { "$ref": "DYNAMIC/subject-human-scientific#" }
            ]
        },
        "gdpr": {
            "allOf": [
                {
                    "type": "object",
                    "properties": {
                        "firstname": { "type": "string" },
                        "lastname": { "type": "string" }
                    }
                },
                { "$ref": "DYNAMIC/subject-human-gdpr#" }
            ]
        }
    }
}
