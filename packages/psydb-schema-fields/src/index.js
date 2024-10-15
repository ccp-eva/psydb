'use strict';
module.exports = {
    ...require('./core-compositions'),

    ListOfObjects: require('./list-of-objects'),

    ...require('./system'),
    ...require('./lab-workflow'),
    ...require('./common'),
    ...require('./date-time'),
    ...require('./other'),
    ...require('./extra'),
}
