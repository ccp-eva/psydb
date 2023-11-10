'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var { ClosedObject, ExactObject, Id, EventId } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');
var { subjectGroup } = require('@mpieva/psydb-schema-creators');

var Schema = () => {
    return Message({
        type: 'subjectGroup/patch',
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
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
            },
            required: [ 'id', 'props' ]
        })
    });
}

module.exports = Schema;
