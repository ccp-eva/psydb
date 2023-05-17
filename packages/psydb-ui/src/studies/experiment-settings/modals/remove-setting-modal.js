import React from 'react';

import { hasNone } from '@mpieva/psydb-core-utils';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';

import {
    Alert,
    LoadingIndicator,
    Button,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';
import * as Items from '../setting-items';

const RemoveSettingModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var { settingRecord } = modalPayloadData;
    var { _id: settingId, type: variantType } = settingRecord;

    var send = useSend(() => ({
        type: `experiment-variant-setting/remove`,
        payload: { id: settingId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    var [ didFetchInfo, fetchedInfo ] = useFetch((agent) => (
        agent.fetchExperimentVariantSettingPreRemoveInfo({ id: settingId })
    ), [ settingId ]);

    if (!didFetchInfo) {
        return <LoadingIndicator size='lg' />
    }
    var {
        canRemove,
        upcomingExperiments,
        unprocessedExperiments,
    } = fetchedInfo.data;

    var SettingItem = ({
        'inhouse': Items.InhouseSetting,
        'away-team': Items.AwayTeamSetting,
        'online-video-call': Items.OnlineVideoCallSetting,
        'online-survey': Items.OnlineSurveySetting
    })[variantType];

    return (
        canRemove ? (
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
                    <Button variant='danger' onClick={ send.exec }>
                        Löschen
                    </Button>
                </div>
            </div>
        ) : (
            <Alert variant='danger'>
                <b>
                    Es existieren noch Termine mit
                    diesem Ablauf und Probandentyp!
                </b>
                <ul className='m-0'>
                    { !hasNone(upcomingExperiments) && (
                        <li><b>
                            { upcomingExperiments.length }
                            {' '}
                            Termine in der Zukunft.
                        </b></li>
                    )}
                    { !hasNone(unprocessedExperiments) && (
                        <li><b>
                            { unprocessedExperiments.length }
                            {' '}
                            Termine die nicht nachbereitet wurden.
                        </b></li>
                    )}
                </ul>
            </Alert>
        )
    );
}

const RemoveSettingModal = WithDefaultModal({
    title: 'Einstellungen löschen',
    size: 'lg',

    Body: RemoveSettingModalBody
});

export default RemoveSettingModal;
