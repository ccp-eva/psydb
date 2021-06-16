import React, { useState, useCallback } from 'react';

import {
    Button
} from 'react-bootstrap';

import ChangeTeamModal from './change-team-modal';

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
            <Button size='sm'>
                Verschieben
            </Button>
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

export default GeneralFunctions;
