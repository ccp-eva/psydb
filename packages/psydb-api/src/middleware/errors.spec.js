'use strict';
var expect = require('chai').expect,
    compose = require('koa-compose'),
    ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    withErrorHandling = require('./errors');

describe('error middleware', () => {

    it('does the thing < 500', async () => {
        var context = {
            app: { emit: (...args) => { console.log(args)}}
        };
        var composition = compose([
            withErrorHandling(),
            async (context, next) => {
                throw new ApiError(400, {
                    apiStatus: 'InvalidMessageSchema'
                });
            }
        ])
        try {
            await composition(context, noop);
            console.log(context);
        }
        catch (e) {
            console.log(e);
        }

        console.log(context);
    });

});

var noop = async () => {}
