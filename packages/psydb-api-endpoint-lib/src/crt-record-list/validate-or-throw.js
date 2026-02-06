'use strict';
var debug = require('./debug')('validateOrThrow');
var { validateOrThrow } = require('@mpieva/psydb-api-lib');

var prepareOrThrow = async (bag) => {
    var { collection, coreSchema, fullSchema, payload, i18n } = bag;
    var { timezone } = i18n;

    debug('start validating');

    validateOrThrow({
        schema: coreSchema,
        payload,
    });
    
    var { target = 'table', recordType = undefined } = request.body;

    var displayFields = undefined;
    var availableConstraints = undefined;
    if (recordType) {
        displayFields = await gatherDisplayFields({
            db, collection, recordType, target,
        });
        availableConstraints = await gatherAvailableConstraints({
            db, collection, recordType
        }); // XXX
    }
    else {
        displayFields = await gatherSharedDisplayFields({
            db, collection, target,
        });
        availableConstraints = []; // XXX
    }

    validateOrThrow({
        schema: fullSchema,
        schema: FullBodySchema({
            availableConstraints,
            availableQuickSearchFields: displayFields
        }),
        payload,
        unmarshalClientTimezone: timezone,
    });
    
    debug('done validating');

    return {
        target, recordType,
        displayFields, availableConstraints
    }
}

module.exports = prepareOrThrow;
