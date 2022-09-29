import React, { useState }  from 'react';
import { Container, Button } from 'react-bootstrap';
import { createSend } from '@mpieva/psydb-ui-utils';

import ExperimentIntervalSummary from '../../experiment-interval-summary';
import { SubjectControls } from '../../experiment-short-controls';

const ExperimentFormContainer = ({
    onHide,
    confirmData,
    experimentData,
    studyData,
    subjectData,

    onSuccessfulUpdate,
}) => {

    var {
        _id: studyId,
        type: studyRecordType,
    } = studyData.record;

    var experimentRecord = experimentData.record;
    var { type: experimentType } = experimentRecord;
    var target = confirmData.experimentRecord;

    var experimentSubjectData = experimentRecord.state.subjectData.find(it => (
        it.subjectId === subjectData.record._id
    ));

    var [ comment, setComment ] = useState(
        experimentSubjectData.comment || ''
    );
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var handleSubmit = createSend(() => ({
        type: `experiment/move-subject-${experimentType}`,
        payload: {
            experimentId: experimentData.record._id,
            subjectId: subjectData.record._id,
            target: {
                experimentId: target._id
            },
            comment,
            autoConfirm,
        }
    }), {
        onSuccessfulUpdate,
        dependencies: [
            experimentData, subjectData, target,
            comment, autoConfirm
        ]
    })

    return (
        <div>
            <Container>
                <SubjectControls { ...({
                    subjectLabel: subjectData.record._recordLabel,
                    comment,
                    autoConfirm,

                    onChangeComment: setComment,
                    onChangeAutoConfirm: setAutoConfirm,
                })} />
            </Container>

            <hr />

            <header className='pb-1'><b>Aktuell</b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentRecord }
                />
            </div>

            <header className='pb-1 mt-3'><b>Verschieben Nach</b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ target }
                />
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button size="sm" onClick={ handleSubmit }>
                    Verschieben
                </Button>
            </div>
        </div>
    )

}

export default ExperimentFormContainer;
