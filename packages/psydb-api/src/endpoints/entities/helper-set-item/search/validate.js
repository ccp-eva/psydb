'use strict';
var {
    validateOrThrow,
    gatherAvailableConstraintsForRecordType,
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var validate = async (context) => {
    var { db, request } = context;
    // FIXME: use cache
    var displayFields = context.__displayFields = makeDisplayFields();
    
    var availableConstraints = await (
        gatherAvailableConstraintsForRecordType({
            db, collectionName: 'helperSetItem',
        })
    );
    
    // TODO: check headers with ajv
    validateOrThrow({
        schema: BodySchema({
            availableConstraints,
            availableFilterFields: displayFields
        }),
        payload: request.body
    });
}

var makeDisplayFields = () => ([
    {
        key: '_label',
        pointer: '/_translatedLabel',
        dataPointer: '/_translatedLabel',
        
        systemType: 'SaneString',
        displayName: 'Label',
        displayNameI18N: { de: 'Bezeichnung' },
    },
    ...[
        { key: 'EN', pointer: '/state/label' },
        { key: 'DE', pointer: '/state/displayNameI18N/de' },
    ].map(({ key, pointer }) => ({
        key: `_label${key}`,
        pointer,
        dataPointer: pointer, // FIXME
        
        systemType: 'SaneString',
        displayName: `Label (${key})`,
        displayNameI18N: { de: `Bezeichnung (${key})` },
    }))
])

module.exports = validate;
