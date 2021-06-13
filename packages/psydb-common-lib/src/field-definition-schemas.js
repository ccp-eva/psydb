'use strict';

// used to define cusom fields per record type

var {
    ExactObject,
    Id,
    ForeignId,
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
        key: IdentifierString({
            title: 'Interner-Key',
            minLength: 1
        }),
        type: {
            const: type,
            //FIXME: required because of
            //https://github.com/rjsf-team/react-jsonschema-form/issues/1241
            default: type,
        },
        displayName: SaneString({
            title: 'Anzeigename',
            minLength: 1
        }),
        props: {
            // so for some wierd reason RJSF explodes when this is an
            // ExactObject that prohibits additionalProps
            // in custom record type field create
            type: 'object',
            properties: props,
            required: required || Object.keys(props)
        }
    },
    required: [
        'key',
        'type',
        'displayName',
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

var PhoneListFieldDefinition = () => FieldDefinition({
    type: 'PhoneList',
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
        setId: ForeignId({
            collection: 'helperSet'
        })
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
    required: [],
    props: {
        minLength: {
            type: 'integer',
            minimum: 0
        }
    }
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    required: [],
    props: {
        minLength: {
            type: 'integer',
            minimum: 0
        }
    },
});

var DateTimeFieldDefinition = () => FieldDefinition({
    type: 'DateTime',
    props: {
        isSpecialAgeFrameField: {
            type: 'boolean',
            default: false
        }
    },
})

var DateOnlyServerSideFieldDefinition = () => FieldDefinition({
    type: 'DateOnlyServerSide',
    props: {
        isSpecialAgeFrameField: {
            type: 'boolean',
            default: false
        }
    },
})

var BiologicalGenderFieldDefinition = () => FieldDefinition({
    type: 'BiologicalGender',
    props: {
        // enableUnknwonValue
    },
});

var ExtBoolFieldDefinition = () => FieldDefinition({
    type: 'ExtBool',
    props: {
        // enableUnknwonValue
    },
});

module.exports = {
    SaneString: SaneStringFieldDefinition,
    FullText: FullTextFieldDefinition,
    Address: AddressFieldDefinition,
    EmailList: EmailListFieldDefinition,
    PhoneList: PhoneListFieldDefinition,
    HelperSetItemIdList: HelperSetItemIdListFieldDefinition,
    ForeignId: ForeignIdFieldDefinition,
    DateTime: DateTimeFieldDefinition,
    DateOnlyServerSide: DateOnlyServerSideFieldDefinition,
    BiologicalGender: BiologicalGenderFieldDefinition,
    ExtBool: ExtBoolFieldDefinition,
}
