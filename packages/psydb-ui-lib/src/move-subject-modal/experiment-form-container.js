import React  from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '../date-fns';
import SchemaForm from '../default-schema-form';

import ExperimentIntervalSummary from '../experiment-interval-summary';

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

    var handleSubmit = () => {
        var message = {
            type: 'experiment/move-subject-inhouse',
            payload: {
                experimentId: experimentData.record._id,
                subjectId: subjectData.record._id,
                target: {
                    experimentId: target._id
                }
            }
        };

        return agent.send({ message }).then(response => {
            onSuccessfulUpdate && onSuccessfulUpdate(response);
        })
    }

    return (
        <div>
            <header><b>Proband</b></header>
            <div className='pt-2 pb-2 pl-4 mb-1'>{
                subjectData.record._recordLabel
            }</div>

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
                <Button onClick={ handleSubmit }>Verschieben</Button>
            </div>
        </div>
    )

}

export default ExperimentFormContainer;
