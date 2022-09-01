import React, { useCallback } from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';
import getTextColor from '../bw-text-color-for-background';


export const ExperimentSlot = ({
    teamRecord,
    onlyLocationId,
    reservationRecord,
    experimentRecord,
    dayStart,
    onSelectExperimentSlot,
    onSelectExperimentPlaceholderSlot,
}) => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'empty',
    ];
    var role = '';

    var isPlaceholder = experimentRecord.state.subjectData.length < 1;
    var isUnselectablePlaceholder = false;
    var onClick = undefined;

    if (!isPlaceholder && onSelectExperimentSlot) {
        classNames.push('selectable');
        role = 'button';
        onClick = () => onSelectExperimentSlot({
            teamRecord,
            reservationRecord,
            experimentRecord,
        });
    }
    if (isPlaceholder && onSelectExperimentPlaceholderSlot) {
        if (
            !onlyLocationId 
            || experimentRecord.state.locationId === onlyLocationId
        ) {
            classNames.push('selectable');
            role = 'button';
            onClick = () => onSelectExperimentPlaceholderSlot({
                teamRecord,
                reservationRecord,
                experimentRecord,
            });
        }
        else {
            isUnselectablePlaceholder = true;
        }
    }

    return (
        <div
            role={ role }
            className={ classNames.join(' ') }
            style={{
                height: '26px',
                backgroundColor: teamRecord.state.color,
            }}
            onClick={ onClick }
        >
            { isPlaceholder 
                ? (
                    isUnselectablePlaceholder
                    ? (
                        <Icons.XOctagon style={{
                            color: getTextColor(teamRecord.state.color),
                            width: '16px',
                            height: '16px',
                            marginTop: '-5px'
                        }} />
                    )
                    : (
                        <Icons.RecordCircle style={{
                            color: getTextColor(teamRecord.state.color),
                            width: '16px',
                            height: '16px',
                            marginTop: '-5px'
                        }} />
                    )
                )
                : (
                    <Icons.CheckCircleFill style={{
                        color: getTextColor(teamRecord.state.color),
                        width: '16px',
                        height: '16px',
                        marginTop: '-5px'
                    }} />
                )
            }
        </div>
    )
}
