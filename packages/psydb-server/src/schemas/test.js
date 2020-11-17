/*SubjectState = {
    scientificId,
    scientific: SubjectScientificState,
    gdprId,
    gdpr: SubjectGDPRState,
}*/ // we actually dont need that

SubjectScientificState = {
    ...Dynamic.SubjectScientific,
    experiments: [
        AppointmentId,
    ],
    location: LocationId,
}

var UpdateSubejctBaseRecordMessage = {
    createdBy: PersonnelId,
    payload: {
        ...SubjectBaseRecord
    }
}
