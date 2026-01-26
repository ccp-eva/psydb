'use strict';
var {
    ClosedObject, DefaultArray, DefaultBool, ForeignId,
    SaneString, FullText, StringConst, MinObject, MaxObject, JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var State = (context) => {
    var schema = ClosedObject({
        'internalName': SaneString({ minLength: 1 }),
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
        ExtraField(),
        SubjectField(),
        InfoTextMarkdown(),
        HR(),
    ]);

    return schema;
}

var ExtraField = (bag) => {
    var schema = MinObject({
        'type': StringConst('extra-field'),
        'systemType': { type: 'string' },
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
