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

var makeDisplayFields = () => (
    [
        { key: '_labelEN', pointer: '/state/label' },
        { key: '_labelDE', pointer: '/state/displayNameI18N/de' },
    ].map(({ key, pointer }) => ({
        key,
        pointer,
        dataPointer: pointer, // FIXME
        
        systemType: 'SaneString',
        displayName: 'Table Name',
        displayNameI18N: { de: 'Tabellen-Bezeichnung' },
    }))
)

module.exports = validate;
