'use strict';

// used to define cusom fields per record type

var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var FieldDefinition = ({
    type,
    props,
    required,
}) => ExactObject({
    title: type, // for rjsf option labels
    properties: {
        key: IdentifierString(),
        type: { const: type },
        props: ExactObject({
            properties: props,
            required: required || Object.keys(props)
        })
    },
    required: [
        'key',
        'type',
        'props',
    ]
})

var EmailListFieldDefinition = () => FieldDefinition({
    type: 'EmailList',
    props: {
        minItems: {
            type: 'integer',
            minimum: 0
        }
    },
})

var HelperSetItemIdListFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemIdList',
    props: {
        set: IdentifierString()
    },
})

var ForeignIdFieldDefinition = () => FieldDefinition({
    type: 'ForeignId',
    props: {
        collection: IdentifierString(),
        recordType: IdentifierString(),
        constraints: {
            type: 'object',
            // TODO: { schoolId: { $data: '1/school' }}
        }
    },
    required: [
        'collection',
        'constraints',
    ]
})

var AddressFieldDefinition = () => FieldDefinition({
    type: 'Address',
    props: {},
});

var SaneStringFieldDefinition = () => FieldDefinition({
    type: 'SaneString',
    props: {},
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    props: {},
});

var DateTimeFieldDefinition = () => FieldDefinition({
    type: 'DateTime',
    props: {
        // TODO: figure out ho to solve this:
        // date fields may exist, bút we need the clients
        // locatime to properly process them into localtime
        // as otherwhise this leads to issues where date of birth
        // is tored as utc moving it one day back
        // because of how timezones work
        //treatAsDateOnlyInUI
        isSpecialAgeFrameField: {
            type: 'boolean',
            default: false
        }
    },
})

module.exports = {
    SaneString: SaneStringFieldDefinition,
    FullText: FullTextFieldDefinition,
    Address: AddressFieldDefinition,
    EmailList: EmailListFieldDefinition,
    HelperSetItemIdList: HelperSetItemIdListFieldDefinition,
    ForeignId: ForeignIdFieldDefinition,
    DateTime: DateTimeFieldDefinition,
}
