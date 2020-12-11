'use stirct';
var parseRecordMessageType = require('./parse-record-message-type'),
    createRecordPropMessages = require('./create-record-prop-messages');

var callMessageHandler = async (context, next) => {
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
            //console.log(it);
            var { subChannelKey, ...message } = it;
            await channel.dispatch({ subChannelKey, message })
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

module.exports = callMessageHandler;
