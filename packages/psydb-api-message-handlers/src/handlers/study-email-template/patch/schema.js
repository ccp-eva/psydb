'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { StudyEmailTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'studyEmailTemplate' }),
        'props': StudyEmailTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
