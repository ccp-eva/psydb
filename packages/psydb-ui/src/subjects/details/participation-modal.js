import React from 'react';

import { useSend } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal, Button } from '@mpieva/psydb-ui-layout';
import { DefaultForm, Fields } from '@mpieva/psydb-ui-lib';
import * as enums from '@mpieva/psydb-schema-enums';

const ParticipationModalBody = (ps) => {
    var {
        subjectId,
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var send = useSend((formData) => ({
        type: 'subject/add-manual-participation',
        payload: {
            ...formData,
            id: subjectId
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]})

    var initialValues = { status: 'participated' };

    return (
        <DefaultForm
            useAjvAsync
            ajvErrorInstancePathPrefix='/payload'
            initialValues={ initialValues }
            onSubmit={ send.exec }
        >
            {(formikProps) => (
                <>
                    <Fields.DateTime
                        dataXPath='$.timestamp'
                        label='Test-Zeitpunkt'
                    />
                    <Fields.ForeignId
                        dataXPath='$.studyId'
                        label='Studie'
                        collection='study'
                        recordType='default' // FIXME
                    />
                    <Fields.GenericEnum
                        dataXPath='$.status'
                        label='Status'
                        options={{
                            ...enums.inviteParticipationStatus.mapping,
                            ...enums.inviteUnparticipationStatus.mapping,
                            ...enums.awayTeamParticipationStatus.mapping
                        }}
                    />
                    <hr />
                    <div className='d-flex justify-content-end'>
                        <Button type='submit'>Speichern</Button>
                    </div>
                </>
            )}
        </DefaultForm>
    )
}

const ParticipationModal = WithDefaultModal({
    title: 'Teilnahme hinzufügen',
    size: 'lg',

    Body: ParticipationModalBody
});

export default ParticipationModal;
