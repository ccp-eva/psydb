import React, { useState, useCallback } from 'react';

import {
    Button
} from 'react-bootstrap';

import ChangeTeamModal from './change-team-modal';
import MoveExperimentModal from './move-experiment-modal';

const GeneralFunctions = ({
    experimentData,
    studyData,
    onSuccessfulUpdate,
}) => {
    return (
        <>

            <ChangeTeamContainer { ...({
                experimentId: experimentData.record._id,
                studyId: studyData.record._id,
                currentTeamId: (
                    experimentData.record.state.experimentOperatorTeamId
                ),
                onSuccessfulUpdate,
            }) } />

            <MoveExperimentContainer { ...({
                experimentData,
                studyData,
                onSuccessfulUpdate,
            }) } />
        </>
    );
}

const ChangeTeamContainer = ({
    experimentId,
    studyId,
    currentTeamId,
    onSuccessfulUpdate,
}) => {
    var [ show, setShow ] = useState(false);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button size='sm' className='mr-3' onClick={ handleShow }>
                Team ändern
            </Button>
            <ChangeTeamModal { ...({
                show,
                onHide: handleHide,

                experimentId,
                studyId,
                currentTeamId,
                onSuccessfulUpdate
            }) } />
        </>
    );
};

const MoveExperimentContainer = ({
    experimentData,
    studyData,
    onSuccessfulUpdate,
}) => {
    var [ show, setShow ] = useState(true);
    var handleShow = useCallback(() => setShow(true), []);
    var handleHide = useCallback(() => setShow(false), []);
    return (
        <>
            <Button size='sm' className='mr-3' onClick={ handleShow }>
                Verschieben
            </Button>
            <MoveExperimentModal { ...({
                show,
                onHide: handleHide,

                experimentData,
                studyData,
                onSuccessfulUpdate
            }) } />
        </>
    );
};

export default GeneralFunctions;
