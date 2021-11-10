module.exports = {
    MatchAlwaysStage: require('./match-always-stage'),

    SystemPermissionStages: require('./system-permission-stages'),
    ProjectDisplayFieldsStage: require('./project-display-fields-stage'),
    MatchIntervalAroundStage: require('./match-interval-around-stage'),
    MatchIntervalOverlapStage: require('./match-interval-overlap-stage'),
    
    StripEventsStage: require('./strip-events-stage'),
    AddLastKnownEventIdStage: require('./add-last-known-event-id-stage'),

    AddSubjectTestabilityFieldsStage: require('./add-subject-testability-fields-stage'),
    HasAnyTestabilityStage: require('./has-any-testability-stage'),

    QuickSearchStages: require('./quick-search-stages'),
    SeperateRecordLabelDefinitionFieldsStage: require('./seperate-record-label-definition-fields-stage'),
    
    MatchConstraintsStage: require('./match-constraints-stage'),
}
