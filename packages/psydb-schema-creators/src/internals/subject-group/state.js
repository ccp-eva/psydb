'use strict';
var inline = require('@cdxoo/inline-text');
var systemPermissionsSchema = require('../../common/system-permissions-schema');

var {
    ClosedObject,
    DefaultArray,
    SaneString,
    DefaultBool,
    CustomRecordTypeKey,
    ForeignId,
    FullText,
} = require('@mpieva/psydb-schema-fields');

var SubjectGroupState = (bag = {}) => {
    var { enableInternalProps, extraOptions = {}} = bag;
    var { enableComment = true } = extraOptions;

    var schema = ClosedObject({
        name: SaneString({
            title: 'Name',
            minLength: 1
        }),
        locationType: CustomRecordTypeKey({
            collection: 'location'
        }),
        locationId: ForeignId({
            collection: 'location'
        }),
        
        systemPermissions: systemPermissionsSchema,
        // NOTE: put in cache maybe
        //memberSubjects: DefaultArray({
        //    items: ClosedObject({
        //        subjectType: CustomRecordTypeKey({
        //            collection: 'subject'
        //        }),
        //        subjectId: ForeignId({
        //            collection: 'subject',
        //            //recordType: { $data: '1/subjectType' }
        //        })
        //    })
        //})
        ...(enableComment && {
            comment: FullText({
                title: 'Kommentar',
            }),
        }),
        ...(enableInternalProps && {
            internals: ClosedObject({
                isRemoved: DefaultBool(),
            })
        })
    }, { systemType: 'SubjectGroupState' })

    return schema;
}

module.exports = SubjectGroupState;
