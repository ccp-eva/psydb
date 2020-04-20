var Koa = require('koa'),
    compose = require('koa-compose'),
    maybeConnectMongoDB = require('db').middleware,

    session = require('./session-middleware');

var Sessions = require('collections/session');

var app = new Koa();

app.use(compose([
    maybeConnectMongoDB({
        url: 'mongodb://127.0.0.1:27017/psydb',
        db: 'psydb',
        useUnifiedTopology: true,
    }),
    session(app),
    async (context, next) => {
        // session will not be created in db when itsnot actually recieves
        // any data; since we have a prop with a setter function here
        context.session = { foo: 'bar' };
        console.log("test");
        // esssion exists in db on second request
        // since its created after the request is processed
        var sessions = await Sessions().find().toArray();
        console.log(sessions);
        context.body = "test\n";
        await next();
    }
]));

app.listen(3012);
