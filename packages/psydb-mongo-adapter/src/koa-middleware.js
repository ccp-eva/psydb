var MongoConnection = require('./mongo-connection');

module.exports = (config) => async (context, next) => {
    var connector = MongoConnection();
    if (!connector) {
        await MongoConnection(config).connect();
    }
    else {
        if (connector.connection) {
            await connector.connection;
        }
        else {
            await connector.connect();
        }
    }
    
    context.db = MongoConnection().getSelectedDb();

    await next();
}
