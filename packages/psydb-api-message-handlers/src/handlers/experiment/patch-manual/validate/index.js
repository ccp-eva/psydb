'use strict';
var { Ajv, validateOrThrow } = require('@mpieva/psydb-api-lib');
var { 
    BaseSchema,
    InviteSchema,
    AwayTeamSchema,
    OnlineSurveySchema,
    ApestudiesWKPRCDefaultSchema,
    ManualOnlyParticipationSchema,
} = require('./schemas');

var validateMessage = async (context) => {
    var { db, message, handler, cache } = context;

    var ajv = Ajv();
    var isValid = undefined;

    validateOrThrow({
        payload: message,
        schema: BaseSchema(handler.type),
        apiStatus: 'InvalidMessageSchema',
    });

    var { experimentId } = message.payload;
    // FIXME: dont we have a helper for that stuff?
    var experiment = await (
        db.collection('experiment')
        .findOne({ _id: experimentId })
    );
    if (!experiment) {
        throw new ApiError(404, {
            apiStatus: 'RecordNotFound',
            data: { collection: 'experiment', id: experimentId }
        });
    }
    
    var labMethod = experiment.realType || experiment.type;
    cache.merge({ experiment, labMethod });
    
    var FullSchema = switchFullSchema(labMethod);
   
    // XXX unmarshaling is dump
    message.payload.experimentId = String(experimentId);
    validateOrThrow({
        payload: message,
        schema: FullSchema(handler.type),
        apiStatus: 'InvalidMessageSchema',
    });

}

var switchFullSchema = (labMethod) => {
    switch (labMethod) {
        case 'online-video-call':
        case 'inhouse':
            return InviteSchema;
        case 'away-team':
            return AwayTeamSchema;
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
