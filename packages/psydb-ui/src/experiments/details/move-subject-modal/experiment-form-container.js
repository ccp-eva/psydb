import React, { useMemo, useEffect, useReducer, useCallback, useState } from 'react';
import { Modal, Form, Container, Col, Row, Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import Pair from '@mpieva/psydb-ui-lib/src/pair';
import Split from '@mpieva/psydb-ui-lib/src/split';
import SchemaForm from '@mpieva/psydb-ui-lib/src/default-schema-form';

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
    var experimentState = experimentData.record.state;
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
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(experimentState.interval.start),
                            'P'
                        ) }
                    </Pair>

                    <Pair label='Beginn'>
                        { datefns.format(
                            new Date(experimentState.interval.start),
                            'p'
                        ) }
                    </Pair>
                    <Pair label='Ende'>
                        { datefns.format(
                            new Date(experimentState.interval.end).getTime() + 1,
                            'p'
                        ) }
                    </Pair>

                </Container>
            </div>

            <header className='pb-1 mt-3'><b>Verschieben Nach</b></header>
            <div className='p-2 bg-white border'>
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(target.state.interval.start),
                            'P'
                        ) }
                    </Pair>
                    <Pair label='Beginn'>
                        { datefns.format(
                            new Date(target.state.interval.start),
                            'p'
                        ) }
                    </Pair>
                    <Pair label='Bis'>
                        { datefns.format(
                            new Date(target.state.interval.end).getTime() + 1,
                            'p'
                        ) }
                    </Pair>
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ handleSubmit }>Verschieben</Button>
            </div>
        </div>
    )

}

export default ExperimentFormContainer;
