const getNewExperimentMaxEnd = ({
    start,
    selectedReservationRecord,
    selectedExperimentRecord,
    reservationRecords,
    experimentRecords,
    upperBoundary,
    slotDuration,
}) => {
    
    // FIXME
    if (selectedExperimentRecord) {
        selectedReservationRecord = selectedExperimentRecord;
    }

    var maxEnd = new Date(upperBoundary);
    
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        var reservationEnd = new Date(item.state.interval.end);

        var isBelowMax = maxEnd > reservationEnd;
        var isOutOfBounds = reservationEnd > upperBoundary;
        if (isBelowMax || isOutOfBounds) {
            continue;
        }
        
        var isOtherTeam = (
            item.state.experimentOperatorTeamId
            !== selectedReservationRecord.state.experimentOperatorTeamId
        );
        if (isOtherTeam) {
            continue;
        }

        // check if continous
        var hasNoGap = (
            maxEnd.getTime() + 1 !== reservationStart.getTime()
        );
        if (hasNoGap) {
            continue;
        }

        maxEnd = reservationEnd;
    }

    var orderedExperiments = (
        experimentRecords
        .filter(it => {
            var expStart = (
                new Date(it.state.interval.start).getTime()
            );
            var selectedStart = (
                new Date(start).getTime()
            );

            return expStart >= selectedStart;
        })
        .sort((a,b) => {
            var startA = new Date(a.state.interval.start).getTime();
            var startB = new Date(b.state.interval.start).getTime();
            return (
                startA < startB ? -1 : 1
            )
        })
    );
    
    var nextExperiment = orderedExperiments[0];
    if (nextExperiment) {
        //console.log(nextExperiment.state.interval);
        var nextExperimentStart = (
            new Date(nextExperiment.state.interval.start)
        );
        if (nextExperimentStart.getTime() < maxEnd.getTime()) {
            maxEnd = new Date(nextExperimentStart.getTime() - 1);
        }
    }
    //console.log({ maxEnd: maxEnd.toISOString() });



    var out = new Date(maxEnd.getTime() + slotDuration);
    //console.log({ out: out.toISOString() });
    return out;
}

export default getNewExperimentMaxEnd;
