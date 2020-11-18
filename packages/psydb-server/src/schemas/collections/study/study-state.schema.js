var schema = {
    allOf: [
        BaseRecord,
        {
            type: 'object',
            properties: {
                instituteId: InstituteId,
                awayTeamIds: {
                    type: 'array',
                    items: AwayTeamId
                },
                locationIds: {
                    type: 'array',
                    items: LocationId
                }
            }
        }
    ]
}
