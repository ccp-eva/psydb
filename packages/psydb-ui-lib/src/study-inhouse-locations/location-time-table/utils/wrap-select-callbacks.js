import getNewReservationMaxEnd from './get-new-reservation-max-end';
import getNewExperimentMaxEnd from './get-new-experiment-max-end';

const wrapSelectCallbacks = (bag) => {
    var {
        onSelectEmptySlot,
        onSelectReservationSlot,
        onSelectExperimentSlot,

        reservationRecords,
        experimentRecords,
        slotDuration,
        upperBoundary,

        calculateNewReservationMaxEnd = getNewReservationMaxEnd,
        calculateNewExperimentMaxEnd = getNewExperimentMaxEnd,
    } = bag;

    var wrappedOnSelectEmptySlot = undefined;
    if (onSelectEmptySlot) {
        wrappedOnSelectEmptySlot = (props) => onSelectEmptySlot({
            ...props,
            maxEnd: calculateNewReservationMaxEnd({
                start: props.start,
                reservationRecords,
                upperBoundary,
                slotDuration,
            }),
        }) 
    }

    var wrappedOnSelectReservationSlot = undefined;
    if (onSelectReservationSlot) {
        wrappedOnSelectReservationSlot = (props) => onSelectReservationSlot({
            ...props,
            maxEnd: calculateNewExperimentMaxEnd({
                start: props.start,
                selectedReservationRecord: props.reservationRecord,
                reservationRecords,
                experimentRecords,
                // TODO: this has an issue, we need experimentRecords
                upperBoundary,
                slotDuration,
            }),
        }) 
    }

    var wrappedOnSelectExperimentSlot = undefined;
    if (onSelectExperimentSlot) {
        wrappedOnSelectExperimentSlot = (props) => onSelectExperimentSlot({
            ...props,
            maxEnd: calculateNewExperimentMaxEnd({
                start: props.start,
                selectedExperimentRecord: props.experimentRecord,
                reservationRecords,
                experimentRecords,
                // TODO: this has an issue, we need experimentRecords
                upperBoundary,
                slotDuration,
            }),
        }) 
    }

    return {
        onSelectEmptySlot: wrappedOnSelectEmptySlot,
        onSelectReservationSlot: wrappedOnSelectReservationSlot,
        onSelectExperimentSlot: wrappedOnSelectExperimentSlot
    }
}

export default wrapSelectCallbacks;
