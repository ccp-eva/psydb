'use strict';
var { OneOf } = require('../core-compositions');
var SimpleMongoConstraint = require('./simple-mongo-constraint');

var DefaultSearchConstraint = (bag) => {
    var { scalar, array } = bag;
    
    var schema = OneOf([
        scalar, array,
        SimpleMongoConstraint({ scalar, array })
    ]);

    return schema;
}

module.exports = DefaultSearchConstraint;
