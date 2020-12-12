'use strict';
var koa = require('koa'),
    webpack = require('webpack'),
    createWebpackMiddleware = require('webpack-dev-middleware'),
    //webpackMiddleware = require('koa-webpack-dev-middleware'),
    bq = require('@cdxoo/block-quote'),

    wpconf = require('../webpack.config');

var app = new koa();

var webpackMiddleware = createWebpackMiddleware(
    webpack(wpconf),
    {
        publicPath: wpconf.output.publicPath
    }
);

app.use(async (context, next) => {
    context.status = 200;
    await webpackMiddleware(context.req, context.res, next);
});

app.use(async (context, next) => {
    
    context.body = bq`
        <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                </head>
            <body>
                <div id="app"></div>
                <script type="text/javascript" src="/dist/bundle.js"></script>
            </body>
        </html>
    `;

    await next();
});
app.listen(3000)
