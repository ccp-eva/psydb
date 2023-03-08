'use strict';
var { ExactObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Message } = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: 'csv-import/create-online-participation-import',
        payload: ExactObject({
            properties: {
                fileId: ForeignId({ collection: 'file' }),
                studyId: ForeignId({ collection: 'study' }),
            },
            required: [ 'fileId', 'studyId' ]
        })
    });
}

module.exports = Schema;
