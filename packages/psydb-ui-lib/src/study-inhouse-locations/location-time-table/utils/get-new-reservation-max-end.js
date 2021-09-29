const getNewReservationMaxEnd = ({
    start,
    reservationRecords,
    upperBoundary,
    slotDuration,
}) => {
    var found;
    for (var item of reservationRecords) {
        var reservationStart = new Date(item.state.interval.start);
        if (
            reservationStart < upperBoundary
            && start < reservationStart
            && (!found || found > reservationStart)
        ) {
            found = reservationStart;
        }
    }
    //console.log(found);
    return new Date((found || upperBoundary).getTime() + slotDuration);
}

export default getNewReservationMaxEnd;
