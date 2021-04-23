var a = {
    subjectTypeSettings: [
        {
            type: 'teacher',
            ageFrameSettings: [
                {
                    ageFrame: { start: 360, end: 720 },
                    conditionList: [
                        {
                            field: 'gender',
                            values: [ 'male' ],
                            canChangePerSearch: true,
                        },
                        {
                            field: 'language',
                            values: [ 'de', 'en' ],
                            canChangePerSearch: false,
                        }
                    ]
                }
            ],
            generalConditionList: [
                {
                    field: 'eatingPermission',
                    values: [ true ],
                    canChangePerSearch: false,
                }
            ],
        }
    ]
}

var b = {
    subjectTypeSettings: []
}

var c = {
    subjectTypeSettings: [
        {
            type: 'teacher',
            ageFrameSettings: [],
            generalConditionList: []
        }
    ]
}

var c = {
    subjectTypeSettings: [
        {
            type: 'teacher',
            ageFrameSettings: [
                {
                    ageFrame: { start: 360, end: 720 },
                    conditionList: [],
                }
            ],
            generalConditionList: []
        }
    ]
}


