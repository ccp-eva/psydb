var construction = {
    location: {
        default: ({ record }) => ({
            state: GenericLocationState({ record })
        }),
        children: {
            building: {
                default: ({ record }) => ({
                    state: BuildingState({ record })
                })
            },
            room: {
                default: ({ record }) => ({
                    state: RoomState({ record })
                }),
            }
        }
    },
    subject: {
        children: {
            animal: {
                default: ({ record }) => ({
                    scientific: {
                        state: AnimalScientificState({ record })
                    },
                    gdpr: {
                        state: AnimalGdprState({ record })
                    }
                })
            },
            human: {
                default: ({ record }) => ({
                    scientific: {
                        state: HumanScientificState({ record })
                    },
                    gdpr: {
                        state: HumanGdprState({ record })
                    }
                })
            },
        }
    },
    experimentOperatorTeam: () => ({
        state: ExperimentOperatorTeamState()
    }),
    reservation: () => ({
        state: ReservationState()
    })
}
