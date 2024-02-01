'use strict';
var nanoid = require('nanoid');
var bcrypt = require('bcrypt');
var deepmerge = require('deepmerge');

var {
    compose, switchComposition,
    withRetracedErrors
} = require('@mpieva/psydb-api-lib');

var { openChannel } = require('../../../lib/generic-record-handler-utils');

var compose_executeSystemEvents = () => compose([
    createRecord,
    generatePassword,
    upsertShadowRecord, // FIXME: why upsert?
]);

var createRecord = async (context, next) => {
    var { db, now, message, cache, rohrpost, dispatchProps } = context;
    var { props } = message.payload;

    var collection = 'personnel';
    var channel = await openChannel({
        db, rohrpost, collection, op: 'create'
    });

    await dispatchProps({
        collection,
        channel,
        subChannelKey: 'gdpr',
        initialize: true,
        props: deepmerge(
            props.gdpr,
            { internals: { lastPasswordChange: now }}
        ),
    });

    await dispatchProps({
        collection,
        channel,
        subChannelKey: 'scientific',
        initialize: true,
        props: props.scientific,
        additionalSchemaCreatorArgs: {
            extraOptions: {
                enableCanLogIn: true,
                enableHasRootAccess: true
            }
        }
    });
   
    cache.merge({ channelId: channel.id });
    await next();
}

var generatePassword = async (context, next) => {
    var { cache } = context;

    var generatedPassword = nanoid.customAlphabet(
        [
            '123456789',
            'abcdefghikmnopqrstuvwxyz',
            'ABCDEFGHJKLMNPQRSTUVWXYZ'
        ].join(''), 24
    )();
    var passwordHash = bcrypt.hashSync(generatedPassword, 10);

    cache.merge({
        generatedPassword, // NOTE: for automatic email
        passwordHash
    })
    await next();
}

var upsertShadowRecord = async (context, next) => {
    var { db, now, cache, personnelId } = context;
    var { channelId, passwordHash } = cache.get();

    await db.collection('personnelShadow').updateOne(
        { _id: channelId },
        { $set: {
            setAt: now,
            setBy: personnelId,
            passwordHash: passwordHash,
        }},
        { upsert: true }
    );

    await next();
}

module.exports = {
    executeSystemEvents: compose_executeSystemEvents()
}
