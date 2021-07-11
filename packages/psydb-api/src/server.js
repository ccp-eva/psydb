require('debug').enable('psydb:*');

var Koa = require('koa'),
    psydbConfig = require('@mpieva/psydb-api-config'),
    createApi = require('./middleware/api');

var app = new Koa();

app.use(
    createApi(app, psydbConfig)
);

app.listen(3012);
