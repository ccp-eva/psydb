var MongoConnection = require('./mongo-connection');

module.exports = (config) => async (context, next) => {
    if (!MongoConnection()) {
        await MongoConnection(config).connect();
    }
    
    context.db = MongoConnection().getSelectedDb();

    await next();
}
