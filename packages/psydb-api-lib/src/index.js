'use strict';
module.exports = {
    // FIXME: createId is async but probably shouldnt be
    createId: require('./create-id'),
    ObjectId: require('mongodb').ObjectId,

    compareIds: require('./compare-ids'),
    fromFacets: require('./from-facets'),
    maybeStages: require('./maybe-stages'),

    Ajv: require('./ajv'),
    ApiError: require('./api-error'),
    withRetracedErrors: require('./with-retraced-errors'),
    FakeAjvError: require('./fake-ajv-error'),
    ResponseBody: require('./response-body'),
    Self: require('./self'),
    CSV: require('./csv'),

    validateOrThrow: require('./validate-or-throw'),
    ...require('./verify-collection-access'),

    verifyRecordExists: require('./verify-record-exists'),
    verifyRecordAccess: require('./verify-record-access'),
    verifyStudyAccess: require('./verify-study-access'),
    verifySubjectAccess: require('./verify-subject-access'),
    verifyLabOperationAccess: require('./verify-lab-operation-access'),
   
    checkForeignIdsExist: require('./check-foreign-ids-exist'),
    checkIntervalHasReservation: require('./check-interval-has-reservation'),

    createAllRecordLabels: require('./create-all-record-labels'),

    createRecordLabel: require('./create-record-label'),
    createRecordLabelFromCRT: require('./create-record-label-from-crt'),
    applyRecordLabels: require('./apply-record-labels'),

    mergeRecordLabelProjections: require('./merge-record-label-projections'),

    createSchemaForRecord: require('./create-schema-for-record'),
    createSchemaForRecordType: require('./create-schema-for-record-type'),

    fetchOneCustomRecordType: require('./fetch-one-custom-record-type'),
    fetchCustomRecordTypes: require('./fetch-custom-record-types'),

    fetchCRTSettings: require('./fetch-crt-settings'),
    fetchCRTSettingsById: require('./fetch-crt-settings-by-id'),
    fetchAllCRTSettings: require('./fetch-all-crt-settings'),

    fetchRecordById: require('./fetch-record-by-id'),
    fetchRecordDisplayDataById: require('./fetch-record-display-data-by-id'),
    fetchRecordReverseRefs: require('./fetch-record-reverse-refs'),
    fetchRecordsByFilter: require('./fetch-records-by-filter'),
    fetchRecordsInInterval: require('./fetch-records-in-interval'),

    fetchRecordLabelsManual: require('./fetch-record-labels-manual'),

    fetchRelatedLabels: require('./fetch-related-labels'),
    fetchRelatedLabelsForMany: require('./fetch-related-labels-for-many-ng'),
    fetchRelatedRecords: require('./fetch-related-records'),
    fetchEnabledLocationRecordsForStudy: require('./fetch-enabled-location-records-for-study'),

    gatherDisplayFieldsForRecordType: require('./gather-display-fields-for-record-type'),
    gatherAvailableConstraintsForRecordType: require('./gather-available-constraints-for-record-type'),

    resolveDataPointer: require('./resolve-data-pointer'),
    resolvePossibleRefs: require('./resolve-possible-refs'),
    createInitialChannelState: require('./create-initial-channel-state'),
    pathifyProps: require('./pathify-props'),

    getIntervalRemovalUpdateOps: require('./get-interval-removal-update-ops'),

    mongoEscapeDeep: require('@cdxoo/mongodb-escape-keys').escape,
    mongoUnescapeDeep: require('@cdxoo/mongodb-escape-keys').unescape,
    
    // FIXME: make this include go away and use core-utils instead
    convertPointerToPath: require('@mpieva/psydb-core-utils').convertPointerToPath,

    convertFiltersToQueryFields: require('./convert-filters-to-query-fields'),
    convertConstraintsToMongoPath: require('./convert-constraints-to-mongo-path'),
    
    compose: require('koa-compose'),
    switchComposition: require('@cdxoo/switch-koa-compose'),

    ...require('./parse-online-participation-csv'),
    ...require('./match-online-participation-csv'),
    
    ...require('./rohrpost-channel-history'),
    ...require('./fetch-crt-pre-remove-info'),
    ...require('./fetch-subject-group-pre-remove-info'),
    ...require('./fetch-helper-set-pre-remove-info'),
    ...require('./fetch-experiment-variant-pre-remove-info'),
    ...require('./fetch-experiment-variant-setting-pre-remove-info'),

    ...require('./generate-api-key'),
    
    getMongoCollation: require('./get-mongo-collation'),
    aggregateToArray: require('./aggregate-to-array'),
    aggregateOne: require('./aggregate-one'),

    mappifyPointer: require('./mappify-pointer'),
    SmartArray: require('./smart-array'),

    twoFactorAuthentication: require('./two-factor-authentication'),
    findAndUpdateSequenceNumber: require('./find-and-update-sequence-number'),
}
