'use strict';

// used to define cusom fields per record type

var {
    ExactObject,
    Id,
    ForeignId,
    EventId,
    IdentifierString,
    SaneString,
    CollectionEnum,

    DefaultArray,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var MinItemsProp = () => ({
    type: 'integer',
    minimum: 0,
    title: 'Mindestanzahl'
});

var MinLengthProp = () => ({
    type: 'integer',
    minimum: 0,
    title: 'Zeichen (mindestens)'
});

var IsNullableProp = () => DefaultBool({
    title: 'Optional'
});

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
        minItems: MinItemsProp(),
    },
})

var PhoneListFieldDefinition = () => FieldDefinition({
    type: 'PhoneList',
    props: {
        minItems: MinItemsProp(),
    },
})

var HelperSetItemIdListFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemIdList',
    props: {
        setId: ForeignId({
            collection: 'helperSet'
        })
    },
    required: [
        'setId'
    ]
})

var HelperSetItemIdFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemId',
    props: {
        setId: ForeignId({
            collection: 'helperSet'
        }),
        isNullable: IsNullableProp(),
    },
    required: [
        'setId',
        'isNullable',
    ],
})

var ForeignIdListFieldDefinition = () => FieldDefinition({
    type: 'ForeignIdList',
    props: {
        collection: CollectionEnum({ title: 'Referenz-Tabelle' }),
        recordType: IdentifierString(),
        constraints: {
            type: 'object',
            // TODO: { schoolId: { $data: '1/school' }}
        },
        minItems: MinItemsProp(),
    },
    required: [
        'collection',
        'constraints',
        'minItems',
    ]
})

var ForeignIdFieldDefinition = () => FieldDefinition({
    type: 'ForeignId',
    props: {
        collection: CollectionEnum({ title: 'Referenz-Tabelle' }),
        recordType: IdentifierString(),
        constraints: {
            type: 'object',
            // TODO: { schoolId: { $data: '1/school' }}
        },
        isNullable: IsNullableProp(),
    },
    required: [
        'collection',
        'constraints',
        'isNullable',
    ]
})

var AddressFieldDefinition = () => FieldDefinition({
    type: 'Address',
    props: {},
});

var GeoCoordsFieldDefinition = () => FieldDefinition({
    type: 'GeoCoords',
    props: {},
});

var SaneStringFieldDefinition = () => FieldDefinition({
    type: 'SaneString',
    required: [],
    props: {
        minLength: MinLengthProp(),
    }
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    required: [],
    props: {
        minLength: MinLengthProp(),
    },
});

var DateTimeFieldDefinition = () => FieldDefinition({
    type: 'DateTime',
    props: {
        isSpecialAgeFrameField: DefaultBool(),
        isNullable: IsNullableProp(),
    },
    required: [
        'isSpecialAgeFrameField',
        'isNullable',
    ]
})

var DateOnlyServerSideFieldDefinition = () => FieldDefinition({
    type: 'DateOnlyServerSide',
    props: {
        isSpecialAgeFrameField: DefaultBool(),
        isNullable: IsNullableProp(),
    },
    required: [
        'isSpecialAgeFrameField',
        'isNullable',
    ]
})

var BiologicalGenderFieldDefinition = () => FieldDefinition({
    type: 'BiologicalGender',
    props: {
        // enableUnknwonValue
    },
});

var EmailFieldDefinition = () => FieldDefinition({
    type: 'Email',
    props: {
        // enableUnknwonValue
    },
});

var PhoneFieldDefinition = () => FieldDefinition({
    type: 'Phone',
    props: {
        // enableUnknwonValue
    },
});

var DefaultBoolFieldDefinition = () => FieldDefinition({
    type: 'DefaultBool',
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

var ListOfObjectsFieldDefinition = () => FieldDefinition({
    type: 'ListOfObjects',
    props: {
        minItems: MinItemsProp(),
        fields: DefaultArray({
            items: {
                type: 'object',
                oneOf: [
                    ...Object.values(ScalarFields).map(it => it())
                ],
            },
            minItems: 1,
            // FIXME: to prevent wierd rjsf behavior
            default: [{ type: 'SaneString' }]
        })
    },
    required: [
        'minItems',
        'fields',
    ]
});

var ScalarFields = {
    SaneString: SaneStringFieldDefinition,
    FullText: FullTextFieldDefinition,

    ForeignId: ForeignIdFieldDefinition,
    HelperSetItemId: HelperSetItemIdFieldDefinition,

    DateTime: DateTimeFieldDefinition,
    DateOnlyServerSide: DateOnlyServerSideFieldDefinition,
    BiologicalGender: BiologicalGenderFieldDefinition,
    DefaultBool: DefaultBoolFieldDefinition,
    ExtBool: ExtBoolFieldDefinition,

    Email: EmailFieldDefinition,
    Phone: PhoneFieldDefinition,
};

var ObjectFields = {
    Address: AddressFieldDefinition,
    GeoCoords: GeoCoordsFieldDefinition,
}

var ListFields = {
    EmailList: EmailListFieldDefinition,
    PhoneList: PhoneListFieldDefinition,
    ForeignIdList: ForeignIdListFieldDefinition,
    HelperSetItemIdList: HelperSetItemIdListFieldDefinition,

    ListOfObjects: ListOfObjectsFieldDefinition,
}

module.exports = {
    ...ScalarFields,
    ...ObjectFields,
    ...ListFields,
}
