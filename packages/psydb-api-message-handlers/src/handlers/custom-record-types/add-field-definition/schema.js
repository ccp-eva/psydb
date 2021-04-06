'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/add-field-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                subChannelKey: {
                    type: 'string',
                    enum: [ 'scientific', 'gdpr' ]
                }, 
                props: {
                    type: 'object',
                    properties: {
                        key: IdentifierString(),
                        type: {
                            type: 'string',
                            enum: [
                                'SaneString',
                                'Address',
                                'HelperSetItemIdList',
                                'EmailList',
                                'ForeignId',
                                'FullText',
                                'DateTime',
                            ],
                        },
                    }
                },
            },
            required: [
                'id',
                'lastKnownEventId',
                'props',
            ]
        })
    });
}

module.exports = Schema;
