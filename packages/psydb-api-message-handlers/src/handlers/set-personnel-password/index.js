'use strict';
var nodemailer = require('nodemailer');
var nanoid = require('nanoid');
var bcrypt = require('bcrypt');
var config = require('@mpieva/psydb-api-config');

var messageType = require('./message-type');
var checkSchema = require('./check-schema');

var shouldRun = (message) => (
    messageType === message.type
)

// throw 400 or 403
var checkAllowedAndPlausible = async ({
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

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
};

var triggerSystemEvents = async ({
    db,
    rohrpost,
    message,
    cache,
    dispatch,
}) => {
    var { type: messageType, personnelId, payload } = message;
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

    await dispatch({
        collection: 'personnel',
        channelId: targetRecordId,
        subChannelKey: 'gdpr',
        payload: { $set: {
            'gdpr.state.internals.passwordHash': passwordHash,
        }}
    });
        
    cache.password = password;
}

var triggerOtherSideEffects = async (options) => {
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

module.exports = {
    shouldRun,
    checkSchema,
    checkAllowedAndPlausible,
    triggerSystemEvents,
    triggerOtherSideEffects,
};
