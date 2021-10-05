import React, { useState } from 'react';
import { Container } from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';

import SubjectControls from './subject-controls';
import ScheduleItemControls from './schedule-item-controls';
import useControlStates from './state-hook';

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
                    <Container>
                        <SubjectControls {...({
                            subjectLabel,
                            comment,
                            autoConfirm,

                            onChangeComment,
                            onChangeAutoConfirm,
                        })} />
                    </Container>
                    <hr />
                </>
            )}

            <Container>
                <ScheduleItemControls { ...({
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
            </Container>
        </div>
    );
}


export default ExperimentShortControls;
export {
    ExperimentShortControls,
    SubjectControls,
    ScheduleItemControls,
    useControlStates
}
