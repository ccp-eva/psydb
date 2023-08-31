import React from 'react';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useSend } from '@mpieva/psydb-ui-hooks';

import { Pair, Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { datefns } from '@mpieva/psydb-ui-lib';


const DeleteModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,
        studyId,

        onSuccessfulUpdate
    } = ps;

    var { teamRecord, interval, reservationRecord } = modalPayloadData;

    var locale = useUILocale();
    var translate = useUITranslation();

    var send = useSend(() => ({
        type: 'reservation/remove-awayteam-slot',
        payload: {
            props: {
                id: reservationRecord._id
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
                <Button variant='danger' size='sm' onClick={ send.exec }>
                    { translate('Delete') }
                </Button>
            </div>
        </div>
    );
}

const DeleteModal = WithDefaultModal({
    Body: DeleteModalBody,

    size: 'md',
    title: 'Delete',
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default DeleteModal;
