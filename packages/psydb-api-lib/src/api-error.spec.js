'use strict';
var expect = require('chai').expect,
    ApiError = require('./api-error');

describe('api-error', () => {

    it('does the thing', () => {
        try {
            throw new ApiError(400);
        }
        catch (e) {
            console.log(e);
            console.log(e.getInfo());
        }
    });

});
