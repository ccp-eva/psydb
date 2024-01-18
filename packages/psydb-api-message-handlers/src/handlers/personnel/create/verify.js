'use strict';
var {
    compose, switchComposition,
    ApiError, aggregateToArray,
} = require('@mpieva/psydb-api-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyNoDuplicateMails
]);

var verifyPermissions = async (context, next) => {
    var { message, permissions } = context;

    if (!permissions.hasFlag('canWritePersonnel')) {
        throw new ApiError(403);
    }

    // TODO: check research group permissions aganst
    // message research groups

    await next();
}

var verifyNoDuplicateMails = async (context, next) => {
    var { db, message } = context;
    var { emails } = message.payload.props.gdpr;

    var duplicates = await aggregateToArray({ db, personnel: [
        { $unwind: '$gdpr.state.emails' },
        { $match: {
            'gdpr.state.emails.email': { $in: (
                emails.map(it => it.email)
            )}
        }},
        { $project: {
            'duplicateMail': '$gdpr.state.emails.email'
        }}
    ]});
    if (duplicates.length > 0) {
        throw new ApiError(409, {
            apiStatus: 'DuplicatePersonnelEmail',
            data: { duplicates }
        })
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
