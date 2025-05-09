'use strict';
var { only } = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var read = async (context, next) => {
    var { db, request, permissions } = context;

    var labMethods = [ 'online-survey' ];
    var pflags = [ 'canPerformOnlineSurveys' ];
    var isAllowed = permissions.hasSomeLabOperationFlags({
        types: labMethods,
        flags: pflags
    });
    if (!isAllowed) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                labProcedureTypes: labMethods,
                flags: pflags,
                checkJoin: 'or',
            }
        })
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { id } = request.body;

    var mapping = [
        { 
            pointer: '/gdpr/state/custom/firstname',
            previewKey: 'gdpr.firstname'
        },
        { 
            pointer: '/gdpr/state/custom/lastname',
            previewKey: 'gdpr.lastname'
        },
        { 
            pointer: '/onlineId',
            previewKey: 'onlineId'
        },
    ]

    var record = await withRetracedErrors(
        db.collection('subject').findOne(
            { _id: id },
        )
    );
    if (!record) {
        throw new ApiError(404)
    }

    var out = only({
        from: record,
        pointers: mapping.map(it => it.pointer)
    });

    context.body = ResponseBody({
        data: {
            mapping,
            record: out
        }
    });

    await next();
}

module.exports = read;
