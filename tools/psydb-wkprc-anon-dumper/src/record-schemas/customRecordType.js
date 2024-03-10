'use strict';
var {
    ClosedObject,
    PatternObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    NullValue,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var DisplayFields = () => (
    DefaultArray({
        items: ClosedObject({
            'dataPointer': AnyString({ anonKeep: true }),
            'systemType': AnyString({ anonKeep: true }),
        }),
    })
);

var Fields = (bag = {}) => {
    var {
        enableNextProps = false,
        enableNestedFields = true
    } = bag;

    var schema = DefaultArray({
        items: ClosedObject({
            'type': AnyString({ anonKeep: true }),
            ...(enableNextProps && {
                'isDirty': DefaultBool({ anonKeep: true }),
                'isNew': DefaultBool({ anonKeep: true }),
            }),
            'displayName': AnyString({ anonKeep: true }),
            'key': AnyString({ anonKeep: true }),
            'pointer': AnyString({ anonKeep: true }),
            'props': ClosedObject({
                'collection': AnyString({ anonKeep: true }),
                'recordType': AnyString({ anonKeep: true }),
                'setId': MongoFk({ collection: 'helperSet', anonKeep: true }),
                
                'addReferenceToTarget': DefaultBool({ anonKeep: true }),
                'targetReferenceField': AnyString({ anonKeep: true }),

                'displayEmptyAsUnknown': DefaultBool({ anonKeep: true }),
                'enableUnknownValue': DefaultBool({ anonKeep: true }),
                'isNullable': DefaultBool({ anonKeep: true }),
                'isSpecialAgeFrameField': DefaultBool({ anonKeep: true }),
                'readOnly': DefaultBool({ anonKeep: true }),

                'minimum': DefaultInt({ anonKeep: true }),
                'minItems': DefaultBool({ anonKeep: true }),
                'minLength': DefaultBool({ anonKeep: true }),
                
                'isAffixRequired': DefaultBool({ anonKeep: true }),
                'isCityRequired': DefaultBool({ anonKeep: true }),
                'isCountryRequired': DefaultBool({ anonKeep: true }),
                'isHousenumberRequired': DefaultBool({ anonKeep: true }),
                'isPostcodeRequired': DefaultBool({ anonKeep: true }),
                'isStreetRequired': DefaultBool({ anonKeep: true }),

                'constraints': PatternObject({
                    '^\\/.*': AnyString({ anonKeep: true })
                }),

                ...(enableNestedFields && {
                    'fields': Fields({ enableNestedFields: false })
                })
            }),
        }),
    });

    return schema;
}

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'collection': AnyString({ anonKeep: true }),
        'type': AnyString({ anonKeep: true }),

        'state': ClosedObject({
            'isNew': DefaultBool({ anonKeep: true }),
            'isDirty': DefaultBool({ anonKeep: true }),
                
            'label': AnyString({ anonKeep: true }),

            'awayTeamSelectionRowDisplayFields': DisplayFields(),
            'tableDisplayFields': DisplayFields(),
            'optionListDisplayFields': DisplayFields(),
            'selectionRowDisplayFields': DisplayFields(),
            'selectionSummaryDisplayFields': DisplayFields(),
            'extraDescriptionDisplayFields': DisplayFields(),
            'inviteConfirmationSummaryDisplayFields': DisplayFields(),

            'commentFieldIsSensitive': DefaultBool({ anonKeep: true }),
            'enableLabTeams': DefaultBool({ anonKeep: true }),
            'enableSubjectSelectionSettings': DefaultBool({ anonKeep: true }),
            'showOnlineId': DefaultBool({ anonKeep: true }),
            'showSequenceNumber': DefaultBool({ anonKeep: true }),
            'requiresTestingPermissions': DefaultBool({ anonKeep: true }),
            'reservationType': AnyString({ anonKeep: true }),

            'formOrder': DefaultArray({
                items: AnyString({ anonKeep: true })
            }),

            'recordLabelDefinition': ClosedObject({
                'format': AnyString({ anonKeep: true }),
                'tokens': DefaultArray({
                    items: ClosedObject({
                        'dataPointer': AnyString({ anonKeep: true }),
                        'systemType': AnyString({ anonKeep: true }),
                    }),
                }),
            }),

            'duplicateCheckSettings': ClosedObject({
                'fieldSettings': DefaultArray({
                    items: ClosedObject({
                        'pointer': AnyString({ anonKeep: true }),
                        'props': ClosedObject({
                        }, { anonT: 'dupCheckFieldPropsObject' })
                    })
                })
            }),

            'nextSettings': ClosedObject({
                'fields': Fields({ enableNextProps: true }),
                'subChannelFields': ClosedObject({
                    'gdpr': Fields({ enableNextProps: true }),
                    'scientific': Fields({ enableNextProps: true }),
                })
            }),
            'settings': ClosedObject({
                'fields': Fields(),
                'subChannelFields': ClosedObject({
                    'gdpr': Fields(),
                    'scientific': Fields(),
                })
            }),
        })
    })

    return schema;
}

module.exports = Schema;
