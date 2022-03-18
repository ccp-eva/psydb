'use strict';
var nodemailer = require('nodemailer');
var nanoid = require('nanoid');
var bcrypt = require('bcrypt');
var deepmerge = require('deepmerge');
var config = require('@mpieva/psydb-api-config');
var {
    createInitialChannelState,
    pathifyProps,
} = require('@mpieva/psydb-api-lib');

var GenericRecordHandler = require('../../lib/generic-record-handler');
var {
    destructureMessage,
    openChannel,
    createRecordPropMessages,
    dispatchRecordPropMessages,
} = require('../../lib/generic-record-handler-utils');

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

module.exports = GenericRecordHandler({
    collection: 'personnel',
    op: 'create',
    triggerSystemEvents: async (options) => {
        var { db, rohrpost, personnelId, message, cache, dispatchProps } = options;
        var destructured = destructureMessage({ message });

        var channel = await openChannel({
            db,
            rohrpost,
            ...destructured
        });
        
        var { props, collection } = destructured;

        var generatedPassword = nanoid.customAlphabet(
            [
                '123456789',
                'abcdefghikmnopqrstuvwxyz',
                'ABCDEFGHJKLMNPQRSTUVWXYZ'
            ].join(''), 24
        )();
        var passwordHash = bcrypt.hashSync(generatedPassword, 10);

        await dispatchProps({
            collection,
            channel,
            subChannelKey: 'gdpr',
            props: deepmerge(
                props.gdpr,
                { internals: { passwordHash }}
            ),
            initialize: true,
        });

        await dispatchProps({
            collection,
            channel,
            subChannelKey: 'scientific',
            props: props.scientific,
            initialize: true,
        });

        /*var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: destructured.props
        });

        recordPropMessages.push({
            type: 'put',
            personnelId,
            subChannelKey: 'scientific',
            payload: {
                prop: '/state/internals/passwordHash',
                value: passwordHash
            }
        })

        await dispatchRecordPropMessages({
            channel,
            ...destructured,
            recordPropMessages
        });*/
        
        cache.generatedPassword = generatedPassword;
    },
    triggerOtherSideEffects: async (options) => {
        var { db, rohrpost, personnelId, message, cache } = options;
        var { generatedPassword } = cache;

        var destructured = destructureMessage({ message });
        var {
            gdpr: { emails },
            scientific: { canLogIn }
        } = destructured.props;

        var recipient = getRecipientMail(emails);

        if (canLogIn && recipient) {
            var transport = nodemailer.createTransport({
                ...config.smtp
            });

            await transport.sendMail({
                from: 'psydb-noreply@eva.mpg.de',
                to: recipient,
                subject: 'PsyDB - Account angelegt',
                text: `Passwort: ${generatedPassword}`,
            })
        }
    }
});
