'use strict';
var { Ajv, validateOrThrow } = require('@mpieva/psydb-api-lib');
var { 
    BaseSchema,
    OnlineSurveySchema,
    ApestudiesWKPRCDefaultSchema,
    ManualOnlyParticipationSchema,
} = require('./schemas');

var validateMessage = async (context) => {
    var { db, message, handler } = context;

    var ajv = Ajv();
    var isValid = undefined;

    validateOrThrow({
        payload: message,
        schema: BaseSchema(handler.type),
        apiStatus: 'InvalidMessageSchema',
    });

    var { labMethod } = message.payload;
    var FullSchema = switchFullSchema(labMethod);
    
    validateOrThrow({
        payload: message,
        schema: FullSchema(handler.type),
        apiStatus: 'InvalidMessageSchema',
    });

}

var switchFullSchema = (labMethod) => {
    switch (labMethod) {
        case 'online-survey':
            return OnlineSurveySchema;
        case 'apestudies-wkprc-default':
            return ApestudiesWKPRCDefaultSchema;
        case 'manual-only-participation':
            return ManualOnlyParticipationSchema;
        default:
            throw new Error(`unknown labMethod ${labMethod}`);
    }
}

module.exports = { validateMessage };
