module.exports = {
    subjectTypeDataForStudy: (
        require('./subject-type-data-for-study')
    ),

    availableTestLocationsForStudy: (
        require('./available-test-locations-for-study')
    ),

    experimentOperatorTeamsForStudy: (
        require('./experiment-operator-teams-for-study')
    ),
    participatedSubjectsForStudy: (
        require('./participated-subjects-for-study')
    ),
    participatedStudiesForSubject: (
        require('./participated-studies-for-subject')
    ),
    studyLocationReservationCalendar: (
        require('./study-location-reservation-calendar')
    ),
    studyAwayTeamReservationCalendar: (
        require('./study-away-team-reservation-calendar')
    ),


    testableSubjectsInhouse: (
        require('./search-subjects-testable/inhouse')
    ),
    searchSubjectsTestableOnline: (
        require('./search-subjects-testable/online')
    ),
    searchSubjectsTestableViaAwayTeam: (
        require('./search-subjects-testable/away-team')
    ),


    selectionSettingsForSubjectTypeAndStudies: (
        require('./selection-settings-for-subject-type-and-studies')
    ),

    testableSubjectTypesForStudies: (
        require('./testable-subject-types-for-studies')
    ),
    
    inviteConfirmationList: (
        require('./invite-confirmation-list')
    ),

    experimentCalendar: (
        require('./experiment-calendar')
    ),
    locationExperimentCalendar: (
        require('./location-experiment-calendar')
    ),

    selectableStudies: (
        require('./selectable-studies')
    ),

    selectableStudiesForCalendar: (
        require('./selectable-studies-for-calendar')
    ),

    extendedExperimentData: (
        require('./extended-experiment-data')
    ),

    experimentPostprocessing: (
        require('./experiment-postprocessing')
    ),

}
