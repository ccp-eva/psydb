'use strict';
var nodemailer = require('nodemailer');
var nanoid = require('nanoid');
var bcrypt = require('bcrypt');
var config = require('@mpieva/psydb-api-config');
var { ApiError } = require('@mpieva/psydb-api-lib');

var { SimpleHandler } = require('../../lib');

var messageType = require('./message-type');
var createSchema = require('./create-schema');

var handler = SimpleHandler({
    messageType,
    createSchema,
});


handler.checkAllowedAndPlausible = async ({
    db,
    message,
    permissions,
}) => {
    var personnelRecord = await (
        db.collection('personnel').findOne({ _id: message.payload.id })
    );

    if (!personnelRecord) {
        throw new ApiError(400);
    }

    if (!permissions.hasFlag('canSetPersonnelPassword')) {
        throw new ApiError(403);
    }
};

handler.triggerSystemEvents = async (context) => {
    var now = new Date();

    var {
        db,
        rohrpost,
        message,
        cache,
        dispatch,
        personnelId,
    } = context;

    var { type: messageType, payload } = message;
    var {
        id: targetRecordId, lastKnownEventId,
        method, password, sendMail
    } = payload;

    if (method === 'auto') {
        password = nanoid.customAlphabet(
            [
                '1234567890',
                'abcdefghikmnpqrstuvwxyz',
                'ABCDEFGHIKMNPQRSTUVWXYZ',
            ].join(''), 24
        )();
    }
    var passwordHash = bcrypt.hashSync(password, 10);

    await db.collection('personnelShadow').updateOne(
        { _id: targetRecordId },
        { $set: {
            setAt: now,
            setBy: personnelId,
            passwordHash,
        }},
        { upsert: true }
    );

    await dispatch({
        collection: 'personnel',
        channelId: targetRecordId,
        subChannelKey: 'gdpr',
        payload: { $set: {
            'gdpr.state.internals.lastPasswordChange': now,
        }}
    });
        
    cache.password = password;
}

handler.triggerOtherSideEffects = async (options) => {
    var { db, message, cache } = options;
    var { id, method, sendMail } = message.payload;
    var { password } = cache;

    if (!(method === 'auto' || method === 'manual' && sendMail)) {
        return;
    }

    var record = await (
        db.collection('personnel').findOne(
            { _id: id },
            { 'gdpr.state.emails': true }
        )
    );

    var recipient = getRecipientMail(record.gdpr.state.emails);
    if (recipient) {
        var transport = nodemailer.createTransport({
            ...config.smtp
        });

        await transport.sendMail({
            from: 'psydb-noreply@eva.mpg.de',
            to: recipient,
            subject: 'PsyDB - Passwort wurde geändert',
            text: `Neues Passwort: ${password}`,
        })
    }
};

// TODO: redundant
var getRecipientMail = (emails) => {
    if (!Array.isArray(emails)) {
        return;
    }

    var filtered = emails.filter(it => it.isPrimary);
    if (filtered.length < 1) {
        return;
    }
    else {
        return filtered[0].email;
    }
}

module.exports = handler;
