'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var {
    ClosedObject,
    CustomRecordTypeKey
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');
var { subjectGroup } = require('@mpieva/psydb-schema-creators');

var Schema = () => {
    return Message({
        type: 'subjectGroup/create',
        payload: ClosedObject({
            subjectType: CustomRecordTypeKey({ collection: 'subject' }),
            props: ClosedObject({
                ...only({
                    from: subjectGroup.State().properties,
                    paths: [
                        'name',
                        'locationType',
                        'locationId',
                        'comment',
                        'systemPermissions'
                    ]
                })
            })
        })
    });
}

module.exports = Schema;
