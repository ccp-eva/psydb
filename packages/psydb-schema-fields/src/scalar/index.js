// FIXME: i think a seperation of scalar fields into theoir own index
// will be handy
'use strict';
module.exports = {
    NullValue: require('./null-value'),
    AnyString: require('./any-string'),

    DefaultBool: require('../default-bool'),
    DateTime: require('../date-time'),
    Integer: require('../integer'), // FIXME
    
    Id: require('../id'),
    ForeignId: require('../foreign-id'),
    HelperSetItemId: require('../helper-set-item-id'),
    
    // FIXME: redir
    DefaultInt: require('../integer'),
    MongoId: require('../id'),
    MongoFk: require('../foreign-id'),
}
