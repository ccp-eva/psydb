'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    SaneString,
    Address,
    FullText,
    DefaultArray,
    ForeignId,
    CustomRecordTypeKey,
    LabMethodKey,
    ForeignIdList,
} = require('@mpieva/psydb-schema-fields');

var ResearchGroupState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            name: SaneString({
                title: 'Bezeichnung',
                minLength: 1
            }),
            shorthand: SaneString({
                title: 'Kürzel',
                minLength: 1
            }),
            address: Address({
                title: 'Adresse',
                required: []
            }),
            description: FullText({
                title: 'Beschreibung',
            }),
            
            studyTypes: DefaultArray({
                items: ExactObject({
                    properties: {
                        id: ForeignId({ collection: 'customRecordType' }),
                        key: CustomRecordTypeKey({ collection: 'study' }),
                    },
                    required: [ 'key' ]
                }),
                minItems: 0,
            }),
            subjectTypes: DefaultArray({
                items: ExactObject({
                    properties: {
                        id: ForeignId({ collection: 'customRecordType' }),
                        key: CustomRecordTypeKey({ collection: 'subject' }),
                    },
                    required: [ 'key' ]
                }),
                minItems: 0,
            }),
            locationTypes: DefaultArray({
                items: ExactObject({
                    properties: {
                        id: ForeignId({ collection: 'customRecordType' }),
                        key: CustomRecordTypeKey({ collection: 'location' })
                    },
                    required: [ 'key' ]
                }),
                minItems: 0,
            }),

            labMethods: DefaultArray({
                items: LabMethodKey(),
                minItems: 0,
            }),

            helperSetIds: ForeignIdList({
                collection: 'helperSet',
            }),
            
            systemRoleIds: ForeignIdList({
                collection: 'systemRole',
            }),
            
            adminFallbackRoleId: ForeignId({
                collection: 'systemRole',
            }),
            
            // TODO: permissions????
            // should they be readable to all?
            // and writable only to root accounts?
            // or normal read/write by researchgroup?
            // => readable to all writable to root
            //recordTypePermissions: ExactObject({
            //    title: 'Datensatz-Typen',
            //    properties: {
            //        subject: DefaultArray({
            //            title: 'Proband:innen-Typen',
            //            items: ExactObject({
            //                properties: {
            //                    typeKey: CustomRecordTypeKey({
            //                        title: 'Typ',
            //                        collection: 'subject',
            //                        enableResearchGroupFilter: false,
            //                    })
            //                },
            //                required: [ 'typeKey' ]
            //            })
            //        }),
            //        location: DefaultArray({
            //            title: 'Location-Typen',
            //            items: ExactObject({
            //                properties: {
            //                    typeKey: CustomRecordTypeKey({
            //                        title: 'Typ',
            //                        collection: 'location',
            //                        enableResearchGroupFilter: false,
            //                    })
            //                },
            //                required: [ 'typeKey' ]
            //            })
            //        }),
            //    },
            //    required: ['subject', 'location']
            //}),
        },
        required: [
            'name',
            'shorthand',
            'address',
            'description',
            //'recordTypePermissions',
        ]
    })

    return schema;
}

module.exports = ResearchGroupState;
