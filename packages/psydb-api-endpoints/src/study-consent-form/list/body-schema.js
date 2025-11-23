'use strict';
var { MaxObject, ExactObject, IdentifierString, DefaultBool }
    = require('@mpieva/psydb-schema-fields');
var { ListBodyCommon, Pagination, Sort }
    = require('@mpieva/psydb-schema-fields-special');

var futils = require('@mpieva/psydb-custom-fields-common');


var BodySchema = (bag) => {
    var common = ListBodyCommon();
    var pagination = Pagination({ maxLimit: 1000 });

    var schema = ExactObject({
        properties: {
            ...common.properties,
            ...pagination.properties,

            recordType: IdentifierString(), // FIXME: enum

            quicksearch: QuickSearch(),
            constraints: SearchConstraints()
            
            sort: Sort(),
        },
        required: [
            'filters',
            ...common.required,
            ...pagination.required,
        ]
    });
    return schema;
}

var QuickSearch = () => {
    var schema = futils.createFullQuickSearchSchema({ definitions: [
        { systemType: 'SaneString', pointer: '/state/internalName' },
        { systemType: 'SaneString', pointer: '/state/title' },
    ]});

    return schema;
}

var SearchConstraints = () => {
    var schema = futils.createFullSearchConstraintsSchema({ definitions: [
        { 
            systemType: 'CustomRecordType', pointer: '/subjectType',
            props: { collection: 'subject' }
        },
        { 
            systemType: 'ForeignId', pointer: '/studyId',
            props: { collection: 'study' }
        },
    ]});

    return schema;
}

module.exports = BodySchema;
