'use strict';
var {
    ResponseBody,
    validateOrThrow,

    allCRTCollections,
    fetchAllCRTSettings,
    fetchAvailableCRTSettings,
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var listAvailable = async (context, next) => {
    var { db, permissions, request } = context;
    
    await validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var {
        collections = allCRTCollections,
        ignoreResearchGroups = false
    } = request.body;

    if (!permissions.isRoot()) {
        ignoreResearchGroups = false;
    }

    var crts = undefined;
    if (ignoreResearchGroups) {
        crts = await fetchAllCRTSettings(db, [
            ...collections.map(it => ({ collection }))
        ], { wrap: false, asTree: false });
    }
    else {
        crts = await fetchAvailableCRTSettings({
            db, permissions, collections,
            wrap: false, asTree: false
        });
    }

    context.body = ResponseBody({
        data: { crts },
    });

    await next();
}

module.exports = { listAvailable }
