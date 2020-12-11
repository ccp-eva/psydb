'use stirct';
var debug = require('debug')('psydb:api:endpoints:event');
    
var compose = require('koa-compose'),
    ObjectId = require('mongodb').ObjectId,
    nanoid = require('nanoid').nanoid,

    withMongoMQ = require('@mpieva/koa-mongo-mq'),
    withRohrpost = require('@mpieva/koa-mongo-rohrpost'),
    schemas = require('@mpieva/psydb-schema').messages,

    withContextSetup = require('./context-setup'),
    withMessageValidation = require('./message-validation'),

    parseRecordMessageType = require('./parse-record-message-type'),
    createRecordPropMessages = require('./create-record-prop-messages'),
    recalculateState = require('./recalculate-state');

var Ajv = require('../../lib/ajv');

var handleIncomingMessage = async (context, next) => {
    var { db, schemas, rohrpost, message } = context;
    var { type: messageType, personnelId, payload } = message;

    if (/^records\//.test(messageType)) {
        var { 
            op, collection, 
            recordType, recordSubtype 
        } = parseRecordMessageType(messageType);

        // FIXME: dispatch silently ignores messages when id is set
        // but record doesnt exist
        var channel = (
            rohrpost
            .openCollection(collection)
            .openChannel({ id: payload.id, isNew: op === 'create' })
        );

        var recordPropMessages = createRecordPropMessages({
            personnelId,
            props: payload.props
        });
        for (var it of recordPropMessages) {
            console.log(it);
            var { subChannelKey, ...message } = it;
            await channel.dispatch({ subChannelKey, message })
        }
        
        // TODO: i think personnel email adresses need special handling
        // to prevent duplicates so i gues sthey have to be a
        // separate message type and need to go into internals
        var modifiedChannels = rohrpost.getModifiedChannels();
        for (var it of modifiedChannels) {
            var { collectionName, id, subChannelKey } = it;

            var record = await (
                db.collection(collectionName).findOne({ _id: id })
            );

            var channelEvents = (
                subChannelKey
                ? record[subChannelKey].events
                : record.events
            );

            var nextState = recalculateState({
                events: channelEvents,
                createDefaultState: () => ({
                    asdf: [],
                })
            });

            console.log(nextState);
        }
    }

     

    //var dispatch = dispatchers[type];
    //await dispatch({ rohrpost, message });

    //console.log(message);
    //var records = await db.collection('mqMessageQueue').find().toArray()
    //console.log(records);
    /*rohrpost.openCollection('personnel').openChannel().dispatch({
        message,
    });*/
    var records = await db.collection('personnel').find().toArray()
    //console.dir(records, { depth: 5 });
    await next();
};


var createMessageHandling = ({
    enableValidation = true,
    forcedPersonnelId,
} = {}) => {
    return compose([
        withContextSetup({ forcedPersonnelId }),
        ...(
            enableValidation
            ? [ withMessageValidation ]
            : []
        ),
        withMongoMQ({
            //createId: () => ObjectId(),
            createId: () => nanoid(),
            ephemeralCollectionName: 'mqMessageQueue',
            persistCollectionName: 'mqMessageHistory',
        }),
        async (context, next) => {
            context.correlationId = context.mqCorrelationId;
            await next();
        },
        withRohrpost({
            createChannelId: () => nanoid(),
            createChannelEventId: () => nanoid(),
            //createChannelId: () => ObjectId(),
            //createChannelEventId: () => ObjectId(),
        }),
        handleIncomingMessage,
    ]);
};

module.exports = createMessageHandling;
