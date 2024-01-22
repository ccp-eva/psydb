import React from 'react';

import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';

import ExperimentEditForm from './experiment-edit-form';

const ParticipationEditModalBody = (ps) => {
    var {
        studyId,
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var {
        _id,
        excludeFromMoreExperimentsInStudy,
        type,
        realType,
        ...participation
    } = modalPayloadData;


    var { experimentId } = participation;
    var labMethodKey = realType || type;
    //console.log(labProcedureType);

    //var send = useSend((formData) => ({
    //    type: 'subject/patch-manual-participation',
    //    payload: {
    //        participationId: _id,
    //        ...formData,
    //    }
    //}), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]});

    //var initialValues = {
    //    studyId,
    //    labProcedureType,
    //    excludeFromMoreExperimentsInStudy,
    //    ...participation
    //};

    return (
        <>
            <ExperimentEditForm
                experimentId={ experimentId }
                labMethodKey={ labMethodKey }
                onSuccessfulUpdate={ demuxed([
                    onHide,
                    onSuccessfulUpdate
                ])}
            />
        </>
    );
}

const ParticipationEditModal = WithDefaultModal({
    title: 'Teilnahme bearbeiten',
    size: 'lg',

    Body: ParticipationEditModalBody
});

export default ParticipationEditModal;
