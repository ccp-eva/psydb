var ensure = require('@mpieva/psydb-schema-fields/ensure');

var fields = {
    ...require('./extra'),
    Address: require('./address'),

    BiologicalGender: require('./biological-gender'),
   
    DateOnlyServerSide: require('./date-only-server-side'),
    DateTime: require('./date-time'),

    DefaultBool: require('./default-bool'),
    EmailList: require('./email-list'),
    Email: require('./email'),
    ExtBool: require('./ext-bool'),

    ForeignIdList: require('./foreign-id-list'),
    ForeignId: require('./foreign-id'),

    FullText: require('./full-text'),
    GeoCoords: require('./geo-coords'),
    HelperSetItemIdList: require('./helper-set-item-id-list'),
    HelperSetItemId: require('./helper-set-item-id'),
    Integer: require('./integer'),
    Lambda: require('./lambda'),
    Phone: require('./phone'),
    PhoneList: require('./phone-list'),
    PhoneWithTypeList: require('./phone-with-type-list'),
    SaneString: require('./sane-string'),
    SaneStringList: require('./sane-string-list'),
    URLString: require('./url-string'),
    URLStringList: require('./url-string-list'),
}

var skipped = [
    'BasicBool',
    'Color',
    'Password',

    'MongoFk', 'MongoFkList', // FIXME: maybe roll back theese?

    'DaysSinceBirth', // FIXME: is that even used?
    'DaysSinceBirthInterval', // FIXME: is that even used?

    'Time', // FIXME: is that used?
    'TimeInterval', // FIXME: is that used?

    'WeekdayBoolObject', // TODO
]

for (var systemType of ensure) {
    if (skipped.includes(systemType)) {
        continue;
    }

    var field = fields[systemType];
    if (!field) {
        throw new Error(`systemType "${systemType}" is not handled`);
    }
    if (!Object.keys(field).includes('createQuickSearchSchema')) {
        throw new Error(
            `"createQuickSearchSchema" is not handled in "${systemType}"`
        );
    }
    if (!Object.keys(field).includes('stringifyValue')) {
        throw new Error(
            `"stringifyValue" is not handled in "${systemType}"`
        );
    }
}

module.exports = fields;
