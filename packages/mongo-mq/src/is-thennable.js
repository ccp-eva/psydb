'use strict';
module.exports = (value) => (
    value && typeof value.then === 'function'
);
