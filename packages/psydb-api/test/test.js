'use strict';
var withApi = require('../src/middleware/api');

var Koa = require('koa');

var app = new Koa();
app.use(withApi(app, {
    db: {
        url: 'mongo://localhost:12001',
        dbName: 'testDB',
        useUnifiedTopology: true,
    }
}))

app.listen(3023)
