var Koa = require('koa'),
    createApi = require('./middleware/api');

var app = new Koa();

app.use(
    createApi(app, {
        db: {
            url: 'mongodb://127.0.0.1:27017/psydb',
            dbName: 'psydb',
            useUnifiedTopology: true,
        }
    })
);

app.listen(3012);
