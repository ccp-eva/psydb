// FIXME: theese arent used as  custom fields
module.exports = {
    Id: require('./id'),

    AgeFrameBoundary: require('./age-frame-boundary'),
    AgeFrameInterval: require('./age-frame-interval'),
    
    DateOnlyServerSideInterval: require('./date-only-server-side-interval'),
    DateTimeInterval: require('./date-time-interval'),
    
    Timezone: require('./timezone'),
    
    WeekdayBoolObject: require('./weekday-bool-object'),
    PersonnelResearchGroupSettingsList: (
        require('./personnel-research-group-settings-list')
    ),
}
