'use strict';
module.exports = {
    BasicBool: require('./basic-bool'),
    DefaultBool: require('./default-bool'),

    Address: require('./address'),
    BiologicalGender: require('./biological-gender'),

    ExtBool: require('./ext-bool'),
    EmailList: require('./email-list'),
    Email: require('./email'),

    Password: require('./password'),

    PhoneWithTypeList: require('./phone-with-type-list'),
    PhoneList: require('./phone-list'),
    Phone: require('./phone'),

    ForeignId: require('./foreign-id'),
    ForeignIdList: require('./foreign-id-list'),
    
    MongoFk: require('./foreign-id'), // NOTE: new
    MongoFkList: require('./foreign-id-list'), // NOTE: new

    FullText: require('./full-text'),
    GeoCoords: require('./geo-coords'),
    
    HelperSetItemId: require('./helper-set-item-id'),
    HelperSetItemIdList: require('./helper-set-item-id-list'),

    SaneString: require('./sane-string'),
    SaneStringList: require('./sane-string-list'),
    Integer: require('./integer'),
    
    URLString: require('./url-string'),
    URLStringList: require('./url-string-list'),

    //ListOfObjects: require('./list-of-objects'),
}
