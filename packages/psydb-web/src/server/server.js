'use strict';
// NOTE: forcing UTC here since dumps from
// diffrent servers that use DateOnlyServerSide
// would get incompatible with one another
// when servers have different timezones
process.env.TZ = 'UTC';

//require('debug').enable('*');

var Koa = require('koa');
var compose = require('koa-compose');

var config = require('@mpieva/psydb-api-config');
var createApi = require('@mpieva/psydb-api');

var withStaticContent = require('./with-static-content');
var withIndexHtmlRoute = require('./with-index-html-route');
var bundlePath = require('./bundle-path');

var createServer = async (bag) => {
    var app = new Koa();
    var composition = compose([
        await createApi({
            app,
            config,
            prefix: '/api'
        }),
        withStaticContent({
            from: bundlePath,
            toPublic: '/'
        }),
        withIndexHtmlRoute({
            bundlePath
        })
    ]);

    app.use(composition);
    app.listen(8080);

    return app;
}

module.exports = createServer;
