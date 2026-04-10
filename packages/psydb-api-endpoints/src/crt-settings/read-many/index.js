'use strict';
var { fetchAllCRTSettings } = require('@mpieva/psydb-db-utils');
var { ResponseBody, validateOrThrow } = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var readMany = async (context, next) => {
    var { db, request, permissions, i18n } = context;
    
    validateOrThrow({ schema: BodySchema(), payload: request.body });
    var { items } = request.body;

    var crtSettings = await fetchAllCRTSettings(db, items, { wrap: true });

    // TODO: filter by research groups

    context.body = ResponseBody({
        data: { crtSettings: crtSettings.map(it => it.getRaw()) }
    });

    await next();
}

module.exports = readMany;
