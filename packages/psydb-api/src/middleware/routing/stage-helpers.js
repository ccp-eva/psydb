'use strict';
var withKoaBody = require('koa-body');
var withSelfAuth = require('../self-auth');
var withPermissions = require('../permissions');

var withPostStages = ({
    endpoint,
    enableApiKeyAuth
}) => ([
    withSelfAuth({ enableApiKeyAuth }),
    withPermissions(),
    withKoaBody(),
    endpoint
]);

var withGetStages = ({
    endpoint,
    enableApiKeyAuth
}) => ([
    withSelfAuth({ enableApiKeyAuth }),
    withPermissions(),
    endpoint
]);

module.exports = {
    withPostStages,
    withGetStages
}
