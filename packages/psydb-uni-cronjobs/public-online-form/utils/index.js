'use strict';
var sane = (v) => String(v).trim();
var lc = (s) => s.toLowerCase();

module.exports = {
    sane, lc,
    ...require('./create-subject-static-props'),
    ...require('./try-create-subject'),
    ...require('./send-error-mail'),
}
