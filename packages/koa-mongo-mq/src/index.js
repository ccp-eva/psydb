'use strict';
var MongoMQ = require('@mpieva/mongo-mq');

var defaultSetupContextProps = (context, envelope) => {
    context.correlationId = envelope._id;
};

var createMongoMQMiddleware = ({
    createId,
    ephemeralCollectionName,
    persistCollectionName,

    createAdditionalEnvelopeProps,
    setupContextProps,
    redactMessageOnPersist,
}) => {

    if (typeof createId !== 'function') {
        throw new Error('parameter "createId" is required and must be a function');
    }
    
    if (!ephemeralCollectionName) {
        throw new Error('parameter "ephemeralCollectionName" is required');
    }

    if (!persistCollectionName) {
        throw new Error('parameter "persistCollectionName" is required');
    }

    if (
        createAdditionalEnvelopeProps
        && typeof createAdditionalEnvelopeProps !== 'function'
    ) {
        throw new Error('parameter "createAdditionalEnvelopeProps" must be a function');
    }

    if (
        setupContextProps
        && typeof setupContextProps !== 'function'
    ) {
        throw new Error('parameter "setupContextProps" must be a function');
    }

    if (
        redactMessageOnPersist
        && typeof redactMessageOnPersist !== 'function'
    ) {
        throw new Error('parameter "redactMessageOnPersist" must be a function');
    }

    setupContextProps = (
        setupContextProps || defaultSetupContextProps
    );

    return async (context, next) => {
        var { db, message } = context;

        if (!db) {
            throw new Error('failed to get database handle from context');
        }
        if (!message) {
            throw new Error('failed to get message from context');
        }

        var mq = MongoMQ({
            db,
            createId,
            ephemeralCollectionName,
            persistCollectionName,
            
            ...(
                createAdditionalEnvelopeProps
                && {
                    additionalEnvelopeProps: (
                        createAdditionalEnvelopeProps(context)
                    ),
                }
            ),
            redactMessageOnPersist,
        });

        var { message, ...envelope } = await mq.add(message);

        setupContextProps(context, envelope);

        await next();

        await mq.persist(envelope._id);
        await mq.remove(envelope._id);
    }
};

module.exports = createMongoMQMiddleware;
