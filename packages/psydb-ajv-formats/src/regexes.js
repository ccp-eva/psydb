'use strict';
module.exports = {
    mongodbObjectId: /^[a-f0-9]{24}$/i,

    date: /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    time: /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i,

    //dateTimeZ: /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?z$/i,
    //dateTime: /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)$/i,
};
