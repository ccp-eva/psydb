'use strict';
var { nanoid } = require('nanoid');

var createId = async (collection) => {
    return nanoid();
}

module.exports = createId;
