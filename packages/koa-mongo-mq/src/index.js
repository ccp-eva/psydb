'use strict';
var MongoMQ = require('@mpieva/mongo-mq');

var createMongoMQMiddleware = ({
    createId,
    ephemeralCollectionName,
    persistCollectionName,

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
        redactMessageOnPersist
        && typeof redactMessageOnPersist !== 'function'
    ) {
        throw new Error('parameter "redactMessageOnPersist" must be a function');
    }

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

            redactMessageOnPersist,
        });

        var { _id: mqCorrelationId } = await mq.add(message);
        
        context.mqCorrelationId = mqCorrelationId;
        await next();

        await mq.persist(mqCorrelationId);
        await mq.remove(mqCorrelationId);
    }
};

module.exports = createMongoMQMiddleware;
