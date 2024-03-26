'use strict';
var {
    ResponseBody,
    validateOrThrow,
    fetchAllCRTSettings
} = require('@mpieva/psydb-api-lib');

var allCRTCollections = require('./all-crt-collections');
var Schema = require('./schema');

var listAvailable = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { collections = allCRTCollections } = request.body;

    // TODO: move that into permissions itself
    var availableTypesByCollection = {
        'subject': permissions.availableSubjectTypes.map(it => it.key),
        'study': permissions.availableStudyTypes.map(it => it.key),
        'location': permissions.availableLocationTypes.map(it => it.key),
        'externalPerson': 'ALL', // FIXME
        'externalOrganization': 'ALL', // FIXME
    }

    var filter = collections.map(it => {
        var recordTypes = availableTypesByCollection[it];
        return {
            collection: it,
            ...(recordTypes !== 'ALL' && { recordTypes })
        }
    });

    var crts = await fetchAllCRTSettings(db, [
        ...filter
    ], { wrap: false, asTree: false });

    context.body = ResponseBody({
        data: {
            crts,
        },
    });

    await next();
}

module.exports = { listAvailable }
