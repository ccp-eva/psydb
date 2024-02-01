'use strict';
var { convertPointerToPath } = require('@mpieva/psydb-core-utils');
var {
    compose, switchComposition,
    withRetracedErrors
} = require('@mpieva/psydb-api-lib');

var compose_executeSystemEvents = () => compose([
    doit,
]);

var doit = async (context, next = noop) => {
    var { db, message, cache } = context;
    var { subjectIds } = message.payload;

    // TODO: create mail record so we can
    //       check qhat mails where send to whom
    // TODO: create experiments
    // TODO: insert participation items into subjects
    //
    // XXX:
    // - should the invites subjects show as read in other
    //   subject selection; yes that has to be tracked somehow
    // - should the onlien survey be shown as upcoming experiments?
    // - invitedAt timestamp/invited status in experiments?
    // - where to postprocess that stuff; we need to be able to
    //   do this manually somewhere
    // - who do we show what ppl were invited? we need ui for that
    // - we need ui for tha sent mail
    //
    // - correlation id tracking für einzelteilnahmen;
    // muss auch dann im csv import irgendwie sein
    // - "eingeladen", 'erinnert', 'teilgenommen'
    //
    // - nachbereiten liste für angeschriebene
    //  - erinnern oder nicht teilgenommen
    //
    // gutschein codes?
    // pro person; und müssen gespeichert werden
    //
    // forschungsreise@eva
    //
    // hey willst du wirklich 100000 kinder anschreiben?
    // nochmal die anzahl eingeben
    //

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
    ];

    var subjects = await withRetracedErrors(
        db.collection('subject').aggregate([
            { $match: {
                '_id': { $in: subjectIds },
                'gdpr.state.custom.emails.0': { $exists: true },
            }},
            { $project: {
                '_emails': '$gdpr.state.custom.emails',

                ...mapping.reduce((acc, { pointer }) => ({
                    ...acc, [convertPointerToPath(pointer)]: true
                }), {})
            }},
            { $unwind: '$_emails' },
            { $match: {
                // NOTE: multiple primaries are possible due to bug
                '_emails.isPrimary': true,
            }},
            { $group: {
                _id: '$_id',
                _that: { $first: '$$ROOT' }
            }},
            { $replaceRoot: { newRoot: '$_that' }}
        ]).toArray()
    );

    //console.log({ subjects });

    cache.merge({ subjects, mapping });
    await next();
}

module.exports = {
    executeSystemEvents: compose_executeSystemEvents()
}
