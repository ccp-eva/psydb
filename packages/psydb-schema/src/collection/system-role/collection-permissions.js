'use strict';
var RecordAccess = require('./record-access'),
    FieldAccess = require('./field-access');

// TODO: we can generate the individual collection
// specific schemas if we wanted to
// via params collecton + typeTree
var CollectionPermissions = () => ({
    type: 'object',
    properties: {
        // TODO: maybe we need to actually
        // make this a key => value thing,
        // since the available permissions per collection actually differ
        // i.e. for location reservation; here individual fields dont make
        // any sense; and for non gdpr records delete is impossible
        collection: { enum: [
            'externalOrganization',
            'externalPersonGdpr',
            'externalPersonScientific',
            'location',
            'personnelGdpr',
            'personnelScientific',
            'subjectGdpr',
            'subjectScientific',
            'systemRole'
        ]},
        recordAccess: RecordAccess(),
        fieldAccess: {
            type: 'array',
            default: [],
            items: FieldAccess(),
        },
        // TODO: in theory we could do schema access here as well
        // do we want that?
    },
    required: [
        'collection',
        'recordAccess',
        'fieldAccess',
    ]
});

module.exports = CollectionPermissions;
