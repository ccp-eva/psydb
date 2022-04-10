var MongoConnection = require('./mongo-connection');

module.exports = (config) => async (context, next) => {
    if (!MongoConnection()) {
        await MongoConnection(config).connect();
    }

    context.mongoClient = MongoConnection().getConnection();
    context.mongoDbName = MongoConnection().getSelectedDbName();
    context.db = MongoConnection().getSelectedDb();

    await next();
}
