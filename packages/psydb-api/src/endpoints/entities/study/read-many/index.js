'use strict';
var { keyBy, ejson } = require('@mpieva/psydb-core-utils');
var { spoolEvents } = require('@mpieva/psydb-rohrpost-utils');

var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow,
    verifyLabOperationAccess,
    aggregateToArray,
    SmartArray,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var readMany = async (context, next) => {
    var { db, request, permissions } = context;

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    // FIXME: thats incomplete; also projection might be dependent on
    // which permission the user has
    // use permissions.hasLabOpsFlags()
    // and permissions.hasCollectionFlag('study', 'read')
    // when only the latter we can only return the ones
    // the user has access to on per record basis
    verifyLabOperationAccess({
        permissions,
        labOperationTypes: 'any',
        flags: [
            'canSelectSubjectsForExperiments',
        ],
        matchTypes: 'some',
        matchFlags: 'some',
    });

    var { ids, projection } = request.body;
    
    var records = await withRetracedErrors(
        aggregateToArray({ db, study: SmartArray([
            { $match: {
                _id: { $in: ids }
            }},
            // XXX
            { $project: {
                'state.shorthand': true
            }}
            //projection && { $project: projection }
        ])})
    );
    if (records.length < 1) {
        throw new ApiError(404)
    }

    context.body = ResponseBody({
        data: { records }
    });

    await next();
}

module.exports = { readMany };
