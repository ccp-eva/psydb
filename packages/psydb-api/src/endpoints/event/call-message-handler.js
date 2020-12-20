'use stirct';
var ResponseBody = require('../../lib/response-body'),
    handlers = require('../../message-handlers');

var callMessageHandler = async (context, next) => {
    var { db, rohrpost, message } = context;
    var { type: messageType, personnelId, payload } = message;

    var handler = handlers.find(messageType);
    await handler({ db, rohrpost, message });

    //var dispatch = dispatchers[type];
    //await dispatch({ rohrpost, message });

    //console.log(message);
    //var records = await db.collection('mqMessageQueue').find().toArray()
    //console.log(records);
    /*rohrpost.openCollection('personnel').openChannel().dispatch({
        message,
    });*/
    //var records = await db.collection('personnel').find().toArray()
    //console.dir(records, { depth: 5 });

    context.body = ResponseBody({ statusCode: 200 });
    await next();
};

module.exports = callMessageHandler;
