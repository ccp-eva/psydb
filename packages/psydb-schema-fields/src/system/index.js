'use strict';
module.exports = {
    CollectionEnum: require('./collection-enum'),

    CustomRecordTypeCollectionEnum: require('./custom-record-type-collection-enum'),
    // FIXME: duplicate
    CustomRecordTypeName: require('./custom-record-type-key'),
    CustomRecordTypeKey: require('./custom-record-type-key'),
    CustomRecordTypeFieldKey: require('./custom-record-type-field-key'),
    
    EventId: require('./event-id'),

    Id: require('./id'),
    IdList: require('./id-list'),

    MongoId: require('./id'), // NOTE: new
    MongoIdList: require('./id-list'), // NOTE: new

    SequenceNumber: require('./sequence-number'),
    OnlineId: require('./online-id'),

    IdentifierString: require('./identifier-string'),
    JsonPointer: require('./json-pointer'),
    LogicGate: require('./logic-gate'),

    StringEnum: require('./string-enum'),
    StringConst: require('./string-const'),
}
