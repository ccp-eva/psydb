'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { StudyEmailMetaTemplate } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'studyEmailMetaTemplate' }),
        'props': StudyEmailMetaTemplate.State(),
    });
    
    return schema;
}

module.exports = Schema;
