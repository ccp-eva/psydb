
const createCalculateNewExperimentMaxEnd = (currentExperimentId) => ({
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

    var maxEnd = undefined;
    
    var orderedReservations = (
        reservationRecords
        .filter(it => {
            var resEnd = (
                new Date(it.state.interval.end).getTime()
            );
            var selectedStart = (
                new Date(start).getTime()
            );

            return (
                resEnd > selectedStart
            );
        })
        .sort((a,b) => {
            var startA = new Date(a.state.interval.end).getTime();
            var startB = new Date(b.state.interval.end).getTime();
            return (
                startA < startB ? -1 : 1
            )
        })
    );
    for (var item of orderedReservations) {
        var reservationStart = new Date(item.state.interval.start);
        var reservationEnd = new Date(item.state.interval.end);

        var isOtherTeam = (
            item.state.experimentOperatorTeamId
            !== selectedReservationRecord.state.experimentOperatorTeamId
        );
        if (isOtherTeam) {
            break;
        }

        var isOutOfBounds = reservationEnd > upperBoundary;
        if (isOutOfBounds) {
            maxEnd = upperBoundary;
            break;
        }
        
        if (maxEnd !== undefined) {
            // check if continous
            var hasGap = (
                maxEnd.getTime() + 1 !== reservationStart.getTime()
            );
            if (hasGap) {
                break;
            }
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

            return (
                currentExperimentId !== it._id
                && expStart > selectedStart
            );
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
        var nextExperimentStart = (
            new Date(nextExperiment.state.interval.start)
        );
        if (nextExperimentStart.getTime() < maxEnd.getTime()) {
            maxEnd = new Date(nextExperimentStart.getTime() - 1);
        }
    }
    //console.log({ maxEnd: maxEnd.toISOString() });



    var out = new Date(maxEnd.getTime() + slotDuration);
    return out;
}

export default createCalculateNewExperimentMaxEnd;
