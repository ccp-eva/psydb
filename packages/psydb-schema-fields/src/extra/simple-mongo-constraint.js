'use strict';
var { OneOf } = require('../core-compositions');

var SimpleMongoConstraint = (bag) => {
    var { array, scalar } = bag;

    return OneOf([
        ClosedObject({ '$eq': scalar }),
        ClosedObject({ '$ne': scalar }),
        ClosedObject({ '$in': array }),
        ClosedObject({ '$nin': array })
    ])
}

module.exports = SimpleMongoConstraint;
