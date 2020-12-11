'use strict';

var wrapInArray = ({ when, then }) => (
    when ? [then] : []
);

module.exports = wrapInArray;

