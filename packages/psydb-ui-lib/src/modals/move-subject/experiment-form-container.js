import React, { useState }  from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { Button, Container } from '@mpieva/psydb-ui-layout';

import ExperimentIntervalSummary from '../../experiment-interval-summary';
import { SubjectControls } from '../../experiment-short-controls';

const ExperimentFormContainer = (ps) => {
    var {
        confirmData,
        experimentData,
        studyData,
        subjectData,

        onSuccessfulUpdate,
    } = ps;

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

    var translate = useUITranslation();

    var send = useSend(() => ({
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

            <header className='pb-1'><b>
                { translate('Current') }
            </b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ experimentRecord }
                />
            </div>

            <header className='pb-1 mt-3'><b>
                { translate('Reschedule To') }
            </b></header>
            <div className='p-2 bg-white border'>
                <ExperimentIntervalSummary
                    experimentRecord={ target }
                />
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ send.exec }>
                    { translate('Reschedule') }
                </Button>
            </div>
        </div>
    )

}

export default ExperimentFormContainer;
