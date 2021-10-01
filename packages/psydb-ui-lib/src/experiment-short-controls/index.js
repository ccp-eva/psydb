import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

import datefns from '../date-fns';
import Pair from '../pair';
import StudyTeamListItem from '../experiment-operator-team-list-item';

import SubjectContainer from './subject-container';
import ScheduleItemContainer from './schedule-item-container';

//FIXME: not sure about this name
const ExperimentShortControls = (ps) => {
    var {
        start,
        end,
        minEnd,
        maxEnd,
        slotDuration,

        subjectLabel,
        comment,
        autoConfirm,

        teamRecords,
        teamId,

        onChangeEnd,
        onChangeComment,
        onChangeAutoConfirm,
        onChangeTeamId
    } = ps;


    return (
        <div>
            { subjectLabel && (
                <>
                    <SubjectContainer {...({
                        subjectLabel,
                        comment,
                        autoConfirm,

                        onChangeComment,
                        onChangeAutoConfirm,
                    })} />
                    <hr />
                </>
            )}

            <ScheduleItemContainer { ...({
                start,
                end,
                minEnd,
                maxEnd,
                slotDuration,
                
                teamId,
                teamRecords,

                onChangeEnd,
                onChangeTeamId,
            })} />
        </div>
    );
}


export default ExperimentShortControls;
export {
    ExperimentShortControls,
    SubjectContainer,
    ScheduleItemContainer
}
