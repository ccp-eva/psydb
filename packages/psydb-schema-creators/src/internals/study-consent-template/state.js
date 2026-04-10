'use strict';
var {
    ClosedObject, DefaultArray, DefaultBool, ForeignId, StringEnum,
    SaneString, FullText, StringConst, MinObject, MaxObject, JsonPointer,
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var State = (context) => {
    var schema = ClosedObject({
        'templateName': SaneString({ minLength: 1 }),
        'title': SaneString({ minLength: 1 }),
        'isEnabled': DefaultBool(),
        'elements': DefaultArray({
            items: StudyConsentFormElement(),
            minItems: 0,
        })
    });
    
    return schema;
}

var StudyConsentFormElement = (bag) => {
    var schema = OneOf([
        ExtraField.DefaultBool(),
        ExtraField.Other(),
        SubjectField(),
        InfoTextMarkdown(),
        HR(),
    ]);

    return schema;
}

var ExtraField = (bag) => {
    var schema = OneOf([
        ExtraField.DefaultBool(),
        ExtraField.Other(),
    ]); 
    return schema;
}

ExtraField.DefaultBool = () => {
    var required = {
        'type': StringConst('extra-field'),
        'systemType': StringConst('DefaultBool'),
        'displayName': SaneString({ minLength: 1 }),
        'displayNameI18N': MaxObject({
            'de': SaneString({ minLength: 0 })
        }),
        'isRequired': DefaultBool(),
    }

    var optional = {
        'requiredValue': {
            type: [ 'string', 'boolean' ],
            enum: [ 'any', true, false ]
        }
    }

    var schema = ExactObject({
        properties: { ...required, ...optional },
        required: Object.keys(required),
    });

    return schema;
}

ExtraField.Other = () => {
    var schema = MinObject({
        'type': StringConst('extra-field'),
        'systemType': StringEnum([
            'SaneString', 'DateOnlyServerSide', 'Address',
            'BiologicalGender',
        ]),
        'displayName': SaneString({ minLength: 1 }),
        'displayNameI18N': MaxObject({
            'de': SaneString({ minLength: 0 })
        }),
        'isRequired': DefaultBool(),
    });

    return schema;
}

var SubjectField = (bag) => {
    var schema = ClosedObject({
        'type': StringConst('subject-field'),
        'pointer': JsonPointer(),
        'isRequired': DefaultBool(),
    });

    return schema;
}

var InfoTextMarkdown = (bag) => {
    var schema = ClosedObject({
        'type': StringConst('info-text-markdown'),
        'markdown': FullText({ minLength: 1 }),
        'markdownI18N': MaxObject({
            'de': FullText({ minLength: 0 }),
        })
    });

    return schema;
}

var HR = (bag) => {
    var schema = ClosedObject({
        'type': StringConst('hr'),
    });

    return schema;
}

var OneOf = (variants) => ({
    type: 'object',
    oneOf: variants,
});

module.exports = State;
