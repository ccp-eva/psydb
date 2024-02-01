'use strict';

var withNowDate = () => async (context, next) => {
    context.now = new Date();
    await next();
}

module.exports = withNowDate;
