var MongoConnection = require('./mongo-connection');

module.exports = (config) => async (context, next) => {
    if (!config) {
        throw new Error('missing db config - check that "config.db" is set');
    }

    if (!MongoConnection()) {
        await MongoConnection(config).connect();
    }

    context.mongoConnector = MongoConnection();
    context.mongoClient = MongoConnection().getConnection();
    context.mongoDbName = MongoConnection().getSelectedDbName();
    context.db = MongoConnection().getSelectedDb();

    await next();
}
