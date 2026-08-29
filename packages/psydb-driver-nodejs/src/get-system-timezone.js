'use strict';

var getSystemTimezone = () => (
    Intl.DateTimeFormat().resolvedOptions().timeZone
);

module.exports = getSystemTimezone;
