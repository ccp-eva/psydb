var Koa = require('koa'),
    compose = require('koa-compose'),
    maybeSession = require('koa-session'),
    maybeConnectMongoDB = require('db').middleware;

var app = new Koa(),
    composition = createKoaComposition(app, {
        db: {
            url: 'mongodb://127.0.0.1:27017/psydb',
            dbName: 'psydb',
            useUnifiedTopology: true,
        }
    });

app.use(composition);

app.listen(3012);
