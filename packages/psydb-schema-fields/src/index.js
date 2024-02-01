'use strict';
module.exports = {
    BasicObject: require('./basic-object'),
    BasicArray: require('./basic-array'),
    BasicBool: require('./basic-bool'),

    DefaultArray: require('./default-array'),
    DefaultBool: require('./default-bool'),

    Address: require('./address'),
    BiologicalGender: require('./biological-gender'),
    Color: require('./color'),

    CollectionEnum: require('./collection-enum'),
    CustomRecordTypeCollectionEnum: require('./custom-record-type-collection-enum'),
    // FIXME: duplicate
    CustomRecordTypeName: require('./custom-record-type-key'),
    CustomRecordTypeKey: require('./custom-record-type-key'),
    CustomRecordTypeFieldKey: require('./custom-record-type-field-key'),

    AgeFrameBoundary: require('./age-frame-boundary'),
    AgeFrameInterval: require('./age-frame-interval'),

    DateTime: require('./date-time'),
    DateTimeInterval: require('./date-time-interval'),
    DateOnlyServerSide: require('./date-only-server-side'),
    DateOnlyServerSideInterval: require('./date-only-server-side-interval'),
    DaysSinceBirth: require('./days-since-birth'),
    DaysSinceBirthInterval: require('./days-since-birth-interval'),
    ExtBool: require('./ext-bool'),
    EmailList: require('./email-list'),
    Email: require('./email'),
    Password: require('./password'),
    EventId: require('./event-id'),
    PhoneWithTypeList: require('./phone-with-type-list'),
    PhoneList: require('./phone-list'),
    Phone: require('./phone'),
    ForeignId: require('./foreign-id'),
    ForeignIdList: require('./foreign-id-list'),
    FullText: require('./full-text'),
    GeoCoords: require('./geo-coords'),
    HelperSetItemId: require('./helper-set-item-id'),
    HelperSetItemIdList: require('./helper-set-item-id-list'),
    Id: require('./id'),
    IdList: require('./id-list'),
    IdentifierString: require('./identifier-string'),
    JsonPointer: require('./json-pointer'),

    ParticipationStatus: require('./participation-status'),
    UnparticipationStatus: require('./unparticipation-status'),
    ProcessedParticipationStatus: require('./processed-participation-status'),
    
    InvitationStatus: require('./invitation-status'),
    SaneString: require('./sane-string'),
    URLString: require('./url-string'),
    SaneStringList: require('./sane-string-list'),
    URLStringList: require('./url-string-list'),
    Time: require('./time'),
    TimeInterval: require('./time-interval'),
    SpecialHumanName: require('./special-human-name'),
    ExactObject: require('./exact-object'), // TODO: rename PartialObject
    OpenObject: require('./open-object'),
    ClosedObject: require('./closed-object'), // TODO: rename ExactObject
    MaxObject: require('./max-object'),
    Integer: require('./integer'),
    
    WeekdayBoolObject: require('./weekday-bool-object'),

    URLString: require('./url-string'),
    URLStringList: require('./url-string-list'),

    ListOfObjects: require('./list-of-objects'),
    StringEnum: require('./string-enum'),
    StringConst: require('./string-const'),
    ExperimentVariantEnum: require('./experiment-variant-enum'),
    ExperimentTypeEnum: require('./experiment-type-enum'),

    LabMethodKey: require('./lab-method-key'),
    Timezone: require('./timezone'),

    ...require('./extra'),
}
