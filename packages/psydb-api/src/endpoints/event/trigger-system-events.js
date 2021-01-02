'use stirct';
var triggerSystemEvents = async (context, next) => {
    var { db, rohrpost, messageHandler, message } = context;

    await messageHandler.triggerSystemEvents({
        db,
        rohrpost,
        message
    });

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

    //context.body = ResponseBody({ statusCode: 200 });
    await next();
};

module.exports = triggerSystemEvents;
