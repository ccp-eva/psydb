import React from 'react';

import { hasNone } from '@mpieva/psydb-core-utils';
import { demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useSend, useFetch } from '@mpieva/psydb-ui-hooks';

import {
    Alert,
    LoadingIndicator,
    Button,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import LabWorkflowSetting from '../lab-workflow-setting';


const RemoveSettingModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,
        availableSubjectCRTs,

        onSuccessfulUpdate,
    } = ps;

    var {
        settingRecord,
        settingRelated,
    } = modalPayloadData;

    var { _id: settingId, type: variantType } = settingRecord;

    var translate = useUITranslation();

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

    return (
        canRemove ? (
            <div>
                <div className='text-danger mb-2'><b>
                    { translate('Really delete theese lab workflow settings?') }
                </b></div>
                <div className='bg-white'>
                    <LabWorkflowSetting
                        type={ variantType }

                        settingRecord={ settingRecord }
                        settingRelated={ settingRelated }
                        availableSubjectCRTs={ availableSubjectCRTs }
                        showButtons={ false }
                    />
                </div>
                <div className='mt-3 d-flex justify-content-end'>
                    <Button variant='danger' onClick={ send.exec }>
                        { translate('Delete') }
                    </Button>
                </div>
            </div>
        ) : (
            <Alert variant='danger'>
                <b>{ translate('There are still appointments with this lab workflow and subject type!') }</b>
                <ul className='m-0'>
                    { !hasNone(upcomingExperiments) && (
                        <li><b>
                            { translate(
                                '${count} upcoming appointments',
                                { count: upcomingExperiments.length }
                            )}
                        </b></li>
                    )}
                    { !hasNone(unprocessedExperiments) && (
                        <li><b>
                            { translate(
                                '${count} unprocessed appointments',
                                { count: unprocessedExperiments.length }
                            )}
                        </b></li>
                    )}
                </ul>
            </Alert>
        )
    );
}

const RemoveSettingModal = WithDefaultModal({
    title: 'Delete Settings',
    size: 'lg',

    Body: RemoveSettingModalBody
});

export default RemoveSettingModal;
