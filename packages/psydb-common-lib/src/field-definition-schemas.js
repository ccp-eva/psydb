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
    title,
    props,
    required,
}) => ExactObject({
    title: title || type, // for rjsf option labels
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
    title: 'Liste von Email-Adressen (EmailList)',
    props: {
        minItems: MinItemsProp(),
    },
})

var PhoneWithTypeListFieldDefinition = () => FieldDefinition({
    type: 'PhoneWithTypeList',
    title: 'Liste von Telefon-Nummern mit Typ (PhoneWithTypeList)',
    props: {
        minItems: MinItemsProp(),
    },
})

var PhoneWithTypeListFieldDefinition = () => FieldDefinition({
    type: 'PhoneList',
    title: 'Liste von Telefon-Nummern ohne Typ (PhoneList)',
    props: {
        minItems: MinItemsProp(),
    },
})

var HelperSetItemIdListFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemIdList',
    title: 'Liste von Hisfstabellen-Einträgen (HelperSetItemIdList)',
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
    title: 'Hisfstabellen-Eintrag (HelperSetItemId)',
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
    title: 'Liste von Einträgen anderer Haupt-Tabellen (ForeignIdList)',
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
    title: 'Eintrag anderer Haupt-Tabellen (ForeignId)',
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
    title: 'Adresse (Address)',
    props: {},
});

var GeoCoordsFieldDefinition = () => FieldDefinition({
    type: 'GeoCoords',
    title: 'Geo-Koordinaten (GeoCoords)',
    props: {},
});

var SaneStringFieldDefinition = () => FieldDefinition({
    type: 'SaneString',
    title: 'Freitext - Einzeilig (SaneString)',
    required: [],
    props: {
        minLength: MinLengthProp(),
    }
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    title: 'Freitext - Mehrzeilig (FullText)',
    required: [],
    props: {
        minLength: MinLengthProp(),
    },
});

var DateTimeFieldDefinition = () => FieldDefinition({
    type: 'DateTime',
    title: 'Datum + Zeit (DateTime)',
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
    title: 'Datum mit Server-Zeitzone (DateOnlyServerSide)',
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
    title: 'Geschlecht (BiologicalGender)',
    props: {
        // enableUnknwonValue
    },
});

var EmailFieldDefinition = () => FieldDefinition({
    type: 'Email',
    title: 'Email-Adress (Email)',
    props: {
        // enableUnknwonValue
    },
});

var PhoneFieldDefinition = () => FieldDefinition({
    type: 'Phone',
    title: 'Telefonnummer (Phone)',
    props: {
        // enableUnknwonValue
    },
});

var DefaultBoolFieldDefinition = () => FieldDefinition({
    type: 'DefaultBool',
    title: 'Ja/Nein-Wert (DefaultBool)',
    props: {
        // enableUnknwonValue
    },
});

var ExtBoolFieldDefinition = () => FieldDefinition({
    type: 'ExtBool',
    title: 'Ja/Nein/Unbekannt-Wert (ExtBool)',
    props: {
        // enableUnknwonValue
    },
});

var IntegerFieldDefinition = () => FieldDefinition({
    type: 'Integer',
    title: 'Ganz-Zahl (Integer)',
    props: {},
});

var ListOfObjectsFieldDefinition = () => FieldDefinition({
    type: 'ListOfObjects',
    title: 'Benutzerdefinierte Unterliste (ListOfObjects)',
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
    Integer: IntegerFieldDefinition,

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
    PhoneWithTypeList: PhoneWithTypeListFieldDefinition,
    ForeignIdList: ForeignIdListFieldDefinition,
    HelperSetItemIdList: HelperSetItemIdListFieldDefinition,

    ListOfObjects: ListOfObjectsFieldDefinition,
}

module.exports = {
    ...ScalarFields,
    ...ObjectFields,
    ...ListFields,
}
