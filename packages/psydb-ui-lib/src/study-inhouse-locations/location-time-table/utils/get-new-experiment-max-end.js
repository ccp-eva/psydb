const getNewExperimentMaxEnd = ({
    start,
    selectedReservationRecord,
    reservationRecords,
    upperBoundary,
    slotDuration,
}) => {
    var maxEnd = new Date(selectedReservationRecord.state.interval.end);
    
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        var reservationEnd = new Date(item.state.interval.end);
        
        if (
            maxEnd > reservationEnd
            || reservationEnd > upperBoundary
        ) {
            continue;
        }
        
        if (
            item.state.experimentOperatorTeamId
            !== selectedReservationRecord.state.experimentOperatorTeamId
        ) {
            continue;
        }

        // check if continous
        if (maxEnd.getTime() + 1 !== reservationStart.getTime()) {
            continue;
        }

        maxEnd = reservationEnd;
    }

    //console.log(maxEnd);

    return new Date(maxEnd.getTime() + slotDuration);
}

export default getNewExperimentMaxEnd;
