var MongoConnection = require('./mongo-connection'),

app.use(
    maybeConnectMongoDB,
);

var maybeConnectMongoDB = (config) => (context, next) => {
    if (!MongoConnection()) {
        await MongoConnection(config).connect();
    }
}
