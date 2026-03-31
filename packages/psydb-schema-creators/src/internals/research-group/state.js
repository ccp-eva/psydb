'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    PartialObject,
    SaneString,
    Address,
    FullText,
    DefaultArray,
    ForeignId,
    CustomRecordTypeKey,
    LabMethodKey,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var CRTRef = (bag) => {
    var { collection } = bag;
    var schema = PartialObject({
        properties: {
            'id': ForeignId({ collection: 'customRecordType' }),
            'key': CustomRecordTypeKey({ collection }),
        },
        required: [ 'key' ]
    });

    return schema;
}

var CRTRefList = (bag) => {
    var { collection, ...pass } = bag;

    var schema = DefaultArray({
        items: CRTRef({ collection }),
        minItems: 0,
        ...pass,
    });

    return schema;
}

var ResearchGroupState = (bag = {}) => {
    var required = {
        'name': SaneString({ minLength: 1 }),
        'shorthand': SaneString({ minLength: 1 }),
        'address': Address({ required: [] }),
        'description': FullText(),
    };
    var optional = {
        'studyTypes': CRTRefList({ collection: 'study' }),
        'subjectTypes': CRTRefList({ collection: 'subject' }),
        'locationTypes': CRTRefList({ collection: 'location' }),

        'labMethods': DefaultArray({ items: LabMethodKey(), minItems: 0 }),

        'helperSetIds': ForeignIdList({ collection: 'helperSet' }),
        'systemRoleIds': ForeignIdList({ collection: 'systemRole' }),
        'adminFallbackRoleId': ForeignId({ collection: 'systemRole' }),
    }
    var schema = PartialObject({
        properties: { ...required, ...optional },
        required: Object.keys(required),
    })

    return schema;
}

module.exports = ResearchGroupState;
