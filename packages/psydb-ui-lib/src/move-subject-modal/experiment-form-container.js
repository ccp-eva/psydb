import React, { useState }  from 'react';
import { Container, Button } from 'react-bootstrap';
import { useSend } from '@mpieva/psydb-ui-hooks';

import ExperimentIntervalSummary from '../experiment-interval-summary';
import { SubjectControls } from '../experiment-short-controls';

const ExperimentFormContainer = ({
    onHide,
    experimentData,
    studyData,
    confirmData,
    subjectData,

    onSuccessfulUpdate,
}) => {

    var studyId = studyData.record._id;
    var studyRecordType = studyData.record.type;
    var experimentRecord = experimentData.record;
    var target = confirmData.experimentRecord;

    var [ comment, setComment ] = useState('');
    var [ autoConfirm, setAutoConfirm ] = useState(false);

    var handleSubmit = useSend(() => ({
        type: 'experiment/move-subject-inhouse',
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
