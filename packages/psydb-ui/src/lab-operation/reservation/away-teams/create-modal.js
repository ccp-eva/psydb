import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';

import { Pair, Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';


const CreateModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,
        studyId,

        onSuccessfulUpdate
    } = ps;

    var { teamRecord, interval } = modalPayloadData;
    
    var locale = useUILocale();
    var translate = useUITranslation();

    var send = useSend(() => ({
        type: 'reservation/reserve-awayteam-slot',
        payload: {
            props: {
                studyId,
                experimentOperatorTeamId: teamRecord._id,
                interval
            }
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] });

    return (
        <div>
            <Pair label={ translate('Team') }>
                <span className='d-inline-block mr-2' style={{
                    backgroundColor: teamRecord.state.color,
                    height: '24px',
                    width: '24px',
                    verticalAlign: 'bottom',
                }} />
                { teamRecord.state.name }
            </Pair>
            <Pair label={ translate('Date') }>
                { datefns.format(interval.start, 'cccc P', { locale })}
            </Pair>
            <hr />
            <div className='d-flex justify-content-end'>
                <Button onClick={ send.exec }>
                    { translate('Reserve') }
                </Button>
            </div>
        </div>
    );
}

const CreateModal = WithDefaultModal({
    Body: CreateModalBody,

    size: 'md',
    title: 'Reservation',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default CreateModal;
