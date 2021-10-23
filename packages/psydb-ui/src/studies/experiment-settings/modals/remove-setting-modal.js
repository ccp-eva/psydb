import React from 'react';

import { createSend, demuxed } from '@mpieva/psydb-ui-utils';
import { Button, WithDefaultModal } from '@mpieva/psydb-ui-layout';
import * as Items from '../setting-items';

const RemoveSettingModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var { settingRecord } = modalPayloadData;
    var { _id: settingId, type: variantType } = settingRecord;

    var handleSubmit = createSend(() => ({
        type: `experiment-variant-setting/remove`,
        payload: { id: settingId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    var SettingItem = ({
        'inhouse': Items.InhouseSetting,
        'away-team': Items.AwayTeamSetting,
        'online-video-call': Items.OnlineVideoCallSetting,
        'online-survey': Items.OnlineSurveySetting
    })[variantType];

    return (
        <div>
            <div className='text-danger mb-2'>
                <b>Diese Einstellungen wirklich löschen?</b>
            </div>
            <div className='bg-white'>
                <SettingItem
                    { ...modalPayloadData }
                    showButtons={ false }
                />
            </div>
            <div className='mt-3 d-flex justify-content-end'>
                <Button variant='danger' onClick={ handleSubmit }>
                    Löschen
                </Button>
            </div>
        </div>
    );
}

const RemoveSettingModal = WithDefaultModal({
    title: 'Einstellungen löschen',
    size: 'lg',

    Body: RemoveSettingModalBody
});

export default RemoveSettingModal;
