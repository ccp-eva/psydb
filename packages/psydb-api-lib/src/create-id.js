'use strict';
var { ObjectId } = require('mongodb');
var { nanoid } = require('nanoid');

var createId = async (collection) => {
    //return nanoid();
    return ObjectId();
}

module.exports = createId;
