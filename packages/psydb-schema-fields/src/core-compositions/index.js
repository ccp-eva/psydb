'use strict';
module.exports = {
    BasicObject: require('./basic-object'),
    BasicArray: require('./basic-array'),

    DefaultArray: require('./default-array'),
    
    ExactObject: require('./exact-object'), // TODO: rename PartialObject
    OpenObject: require('./open-object'),
    ClosedObject: require('./closed-object'), // TODO: rename ExactObject
    MaxObject: require('./max-object'),
    MinObject: require('./min-object'),
}
