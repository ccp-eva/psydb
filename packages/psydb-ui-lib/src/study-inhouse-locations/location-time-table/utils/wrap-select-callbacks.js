import getNewReservationMaxEnd from './get-new-reservation-max-end';
import getNewExperimentMaxEnd from './get-new-experiment-max-end';

const wrapSelectCallbacks = ({
    onSelectEmptySlot,
    onSelectReservationSlot,
    onSelectExperimentSlot,

    reservationRecords,
    experimentRecords,
    slotDuration,
    upperBoundary,
}) => {

    var wrappedOnSelectEmptySlot = undefined;
    if (onSelectEmptySlot) {
        wrappedOnSelectEmptySlot = (props) => onSelectEmptySlot({
            ...props,
            maxEnd: getNewReservationMaxEnd({
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
            maxEnd: getNewExperimentMaxEnd({
                start: props.start,
                selectedReservationRecord: props.reservationRecord,
                reservationRecords,
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
        }) 
    }

    return {
        onSelectEmptySlot: wrappedOnSelectEmptySlot,
        onSelectReservationSlot: wrappedOnSelectReservationSlot,
        onSelectExperimentSlot: wrappedOnSelectExperimentSlot
    }
}

export default wrapSelectCallbacks;
