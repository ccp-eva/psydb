var withPersistingMQ = ({
    createId,
    ephemeralCollectionName: maybeEphemeral,
    persistCollectionName: maybePersist,
    redact, // FIXME: is there an elegant way of message redaction?
    db: maybeDb
}) => async (context, next) => {
    var mqContext = context.mq || {};

    var db = mqContext.db || context.db || maybeDB,
        ephemeral = mqContext.ephemeralCollectionName || maybeEphemeral,
        persist = mqContext.persistCollectionName || maybePersist;

    if (!db) {
        throw new Error(
            `neither options.db nor context.mq.db nor context.db were set`
        );
    }
    var mq = MongoMQ({
        collection: db.collection(ephemeral),
        createId,
    });

    var correlationMessage = await mq.add(mqContext.message);
    mqContext.correlationId = correlationMessage._id;


    await next();


    var redacted = redact(correlationMessage);
    await db.collection(persist).insert(redacted);

    await mq.remove(correlationMessage._id);
};

var withMessageBrokering = async (context, next) => {
    var cachedBrokers = {},
        modified = [];

    var wrapper = {
        correlationId: undefined,
        createChannelId: undefined,
        createMessageId: undefined,

        areChannelIDsEqual: (a, b) => (String(a) === String(b))
    };

    var onDispatch = async ({
        rohrpostKey,
        channelId,
        ...other
    }) => {
        await storeChannelEvent({
            rohrpostKey,
            channelId,
            ...other,
            
            db,
            correlationId: wrapper.correlationId,
        });

        modified.push({
            broker: rohrpostKey,
            channel: channelId,
        });
    },

    wrapper.create = (key) => (
        cachedBrokers[key] || Rohrpost({
            key,
            
            createChannelId: wrapper.createChannelId,
            createMessageId: wrapper.createMessageId,
            
            onDispatch,
        })
    );

    /*context.dispatch = ({ broker, channel, type, payload }) => {}

    context.createBroker('study').openChannel('12345').dispatch({})

    context.dispatch({
        broker: 'study',
        channel: id(12345),
        message: {
            type: 'add-tested-child',
            payload: { childId }
        }
    })*/
}

var storeEvent = async ({
    db,
    rohrpostKey,

    channelId,
    isNewChannel,

    id,
    timestamp,
    message,
    correlationId,
}) => {
    // FIXME: instanceof promise might not handle all thennables
    if (channelId instanceof Promise) {
        channelId = await channelId;
    }
    if (id instanceof Promise) {
        id = await id;
    }
};

router([
    prepareMessageProcessingContext,
    isMessageOk,

    withUnlockAllChannels,
        withPersistingMQ,
            controller.method,        
])
