'use strict';
var {
    EJSONRouter,
    ParamTypes
} = require('routers');

var createRouter = (config) => {
    var router = EJSONRouter({
        prefix: config.router.basePrefix + '/dynamic-schemas',
        middlewares: [
            secured,
        ]
    });

    router.get({
        path: '/',
        pipeline: [
            controller.index
        ]
    });

    router.get({
        path: '/:collectionName',
        params: {
            collectionName: ParamTypes.String,
        },
        pipeline: [
            controller.read
        ]
    });

    return router;
}
