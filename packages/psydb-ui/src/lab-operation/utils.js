export const checkTeamsReservable = (labMethodSettings) => (
    !!labMethodSettings.find(it => (
        ['away-team'].includes(it.type)
    ))
)

export const checkLocationsReservable = (labMethodSettings) => (
    !!labMethodSettings.find(it => (
        ['inhouse', 'online-video-call'].includes(it.type)
    ))
)
