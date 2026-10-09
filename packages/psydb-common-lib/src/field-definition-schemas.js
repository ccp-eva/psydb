'use strict';

// used to define cusom fields per record type

var {
    ExactObject,
    OpenObject,
    ClosedObject,
    Id,
    ForeignId,
    EventId,
    IdentifierString,
    SaneString,
    StringEnum,
    StringConst,
    CollectionEnum,

    DefaultArray,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var MinItemsProp = () => ({ type: 'integer', minimum: 0 });
var MinLengthProp = () => ({ type: 'integer', minimum: 0 });

var IsNullableProp = () => DefaultBool();
var IsSensitiveProp = () => DefaultBool();

var FieldDefinition = (bag) => {
    var { type, props, required = undefined } = bag;

    return ClosedObject({
        'key': IdentifierString({ minLength: 1 }),
        'type': StringConst(type),
        'displayName': SaneString({ minLength: 1 }),
        'displayNameI18N': OpenObject({
            'de': SaneString()
        }),
        'props': ExactObject({
            properties: props,
            required: required || Object.keys(props)
        })
    })
}

var EmailListFieldDefinition = () => FieldDefinition({
    type: 'EmailList',
    props: {
        'minItems': MinItemsProp(),
    },
})

var PhoneWithTypeListFieldDefinition = () => FieldDefinition({
    type: 'PhoneWithTypeList',
    props: {
        'minItems': MinItemsProp(),
    },
})

var PhoneListFieldDefinition = () => FieldDefinition({
    type: 'PhoneList',
    props: {
        'minItems': MinItemsProp(),
    },
})

var HelperSetItemIdListFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemIdList',
    props: {
        'setId': ForeignId({ collection: 'helperSet' }),
        'minItems': MinItemsProp(),
    },
    required: [ 'setId' ]
})

var HelperSetItemIdFieldDefinition = () => FieldDefinition({
    type: 'HelperSetItemId',
    props: {
        'setId': ForeignId({ collection: 'helperSet' }),
        'isNullable': IsNullableProp(),
        'displayEmptyAsUnknown': DefaultBool(),
    },
    required: [ 'setId', 'isNullable', 'displayEmptyAsUnknown' ],
})

var ForeignIdListFieldDefinition = () => FieldDefinition({
    type: 'ForeignIdList',
    props: {
        'collection': CollectionEnum(),
        'recordType': IdentifierString(),
        'constraints': OpenObject({
            // TODO: { schoolId: { $data: '1/school' }}
        }),
        'minItems': MinItemsProp(),
        'readOnly': DefaultBool(),
    },
    required: [ 'collection', 'constraints', 'minItems', 'readOnly' ]
})

var ForeignIdFieldDefinition = () => FieldDefinition({
    type: 'ForeignId',
    props: {
        'collection': CollectionEnum(),
        'recordType': IdentifierString(),
        'constraints': OpenObject({
            // TODO: { schoolId: { $data: '1/school' }}
        }),
        'isNullable': IsNullableProp(),
        'displayEmptyAsUnknown': DefaultBool(),
        'addReferenceToTarget': DefaultBool(),
        'targetReferenceField': { type: 'string' } // TODO jsonpointer
    },
    required: [
        'collection',
        'constraints',
        'isNullable',
        'displayEmptyAsUnknown',
        'addReferenceToTarget',
        //'targetReferenceField'
    ]
})

var AddressFieldDefinition = () => FieldDefinition({
    type: 'Address',
    props: {
        'isStreetRequired': DefaultBool(),
        'isHousenumberRequired': DefaultBool(),
        'isAffixRequired': DefaultBool(),
        'isPostcodeRequired': DefaultBool(),
        'isCityRequired': DefaultBool(),
        'isCountryRequired': DefaultBool(),
    },
});

var GeoCoordsFieldDefinition = () => FieldDefinition({
    type: 'GeoCoords', props: {},
});

var SaneStringFieldDefinition = () => FieldDefinition({
    type: 'SaneString',
    props: {
        'minLength': MinLengthProp(),
    }
});

var SaneStringListFieldDefinition = () => FieldDefinition({
    type: 'SaneStringList',
    props: {
        'minItems': MinItemsProp(),
    }
});

var URLStringFieldDefinition = () => FieldDefinition({
    type: 'URLString',
    props: {
        'minLength': MinLengthProp(),
    }
})

var URLStringListFieldDefinition = () => FieldDefinition({
    type: 'URLStringList',
    props: {
        'minItems': MinItemsProp(),
    }
});

var FullTextFieldDefinition = () => FieldDefinition({
    type: 'FullText',
    props: {
        'minLength': MinLengthProp(),
        'isSensitive': IsSensitiveProp(),
    },
});

var DateTimeFieldDefinition = () => FieldDefinition({
    type: 'DateTime',
    props: {
        'isSpecialAgeFrameField': DefaultBool(),
        'isNullable': IsNullableProp(),
    },
})

var DateOnlyServerSideFieldDefinition = () => FieldDefinition({
    type: 'DateOnlyServerSide',
    props: {
        'isSpecialAgeFrameField': DefaultBool(),
        'isNullable': IsNullableProp(),
    },
})

var BiologicalGenderFieldDefinition = () => FieldDefinition({
    type: 'BiologicalGender',
    props: {
        'enableUnknownValue': DefaultBool(),
        'enableOtherValue': DefaultBool(),
    },
});

var EmailFieldDefinition = () => FieldDefinition({
    type: 'Email',
    props: {
        'minLength': MinLengthProp(),
    },
});

var PhoneFieldDefinition = () => FieldDefinition({
    type: 'Phone',
    props: {
        'minLength': MinLengthProp(),
    },
});

var DefaultBoolFieldDefinition = () => FieldDefinition({
    type: 'DefaultBool',
    props: {},
});

var ExtBoolFieldDefinition = () => FieldDefinition({
    type: 'ExtBool',
    props: {},
});

var IntegerFieldDefinition = () => FieldDefinition({
    type: 'Integer',
    props: {
        'minimum': { type: 'integer' }, // FIXME
        'isNullable': IsNullableProp(),
    },
});

var ListOfObjectsFieldDefinition = () => FieldDefinition({
    type: 'ListOfObjects',
    props: {
        'minItems': MinItemsProp(),
        'fields': DefaultArray({
            items: {
                type: 'object', // FIXME
                oneOf: [
                    ...Object.values(ScalarFields).map(it => it()),
                    AddressFieldDefinition(),
                ],
            },
            minItems: 1,
            // FIXME: to prevent wierd rjsf behavior
            default: [{ type: 'SaneString' }]
        })
    },
    required: [ 'minItems', 'fields' ]
});

var LambdaFieldDefinition = () => FieldDefinition({
    type: 'Lambda',
    props: {
        'fn': StringEnum([ 'deltaYMD' ]),
        'input': { type: 'string' } //XXX jsonpointer
    },
    required: [ 'fn', 'input' ]
})

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
    URLString: URLStringFieldDefinition,
};

var ObjectFields = {
    Address: AddressFieldDefinition,
    GeoCoords: GeoCoordsFieldDefinition,
}

var ListFields = {
    URLStringList: URLStringListFieldDefinition,
    SaneStringList: SaneStringListFieldDefinition,
    EmailList: EmailListFieldDefinition,
    PhoneWithTypeList: PhoneWithTypeListFieldDefinition,
    PhoneList: PhoneListFieldDefinition,
    ForeignIdList: ForeignIdListFieldDefinition,
    HelperSetItemIdList: HelperSetItemIdListFieldDefinition,

    ListOfObjects: ListOfObjectsFieldDefinition,
}

module.exports = {
    ...ScalarFields,
    ...ObjectFields,
    ...ListFields,

    Lambda: LambdaFieldDefinition,
}
