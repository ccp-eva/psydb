'use strict';

var rx = (str) => new RegExp(str.replace(/\s*\n\s*/g, ''))

module.exports = {
    mongodbObjectId: /^[a-f0-9]{24}$/i,
    nanoidDefault: /^[a-z0-9\_\-]{21}$/i,

    date: /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
    time: /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i,

    timeHM: /^([0-1][0-9]|[2][0-3]):[0-5][0-9]$/,

    germanPhoneNumber: rx(`
       ^
       (
            \\+\\d{1,2}
            \\s?(\\(0\\)\\s?)?
            |
            0
        )
        \\d{2,4}
        (\\s?\\/\\s?)?
        
        (\\d{1,}\\s*){4,}
        $
    `),

    hexColor: rx(`
        ^#[a-fA-F0-9]{6}$
    `),
    emailOptional: /^(?:|[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
    //dateTimeZ: /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?z$/i,
    //dateTime: /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d:\d\d)$/i,
};
