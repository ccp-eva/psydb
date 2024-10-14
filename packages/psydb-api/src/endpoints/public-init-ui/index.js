'use strict';
var debug = require('debug')('psydb:api:endpoints:public:initUI');

var { only } = require('@mpieva/psydb-core-utils');
var { Permissions } = require('@mpieva/psydb-common-lib');
var { ApiError, ResponseBody } = require('@mpieva/psydb-api-lib');
var { performSelfAuth } = require('@mpieva/psydb-api-self-auth');


var publicInitUI = async (context, next) => {
    var { db, session, request, apiConfig } = context;

    var authStatusCode = 401;
    var self = undefined;
    var permissions = undefined;
    try {
        self = await performSelfAuth({
            db, session, request, apiConfig, enableApiKeyAuth: false,
        });
        permissions = Permissions.fromSelf({ self });
        authStatusCode = 200;
    } catch (e) {
        if (e instanceof ApiError) {
            authStatusCode = e.__info.statusCode;
        }
        else {
            throw e;
        }
    }
   
    // FIXME: not sure if required: 
    if (self && self.requires2FACode) {
        authStatusCode = 803;
    }

    var config = only({ from: apiConfig, pointers: [
        '/i18n',
        '/enabledLabMethods',
        '/twoFactorAuth',
        '/branding',
        '/disableLogoOverlay',

        '/dev_enableStagingBanner',
        '/dev_enableDevPanel',
        '/dev_copyNoticeGreyscale',
        '/dev_enableForeignIdRefLinkInForms',
        '/dev_enableCSVSubjectImport',
        '/dev_enableCSVParticipationImport',
        '/dev_enableStatistics',
    ]});

    var configHashSum = '';

    context.body = ResponseBody({ data: {
        configHashSum,
        config,
        authStatusCode,
        ...(self && { self: {
            record: self.record,
            permissions
        }})
    }})
    
    await next();
}

module.exports = publicInitUI;
