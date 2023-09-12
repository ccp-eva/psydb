import React from 'react';

import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';

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

const RemoveVariantModalBody = (ps) => {
    var {
        onHide,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var { index, variantRecord } = modalPayloadData;
    var { _id: variantId, type: variantType } = variantRecord;

    var translate = useUITranslation();

    var send = useSend(() => ({
        type: `experiment-variant/remove`,
        payload: { id: variantId }
    }), {
        onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ]
    });

    var [ didFetchInfo, fetchedInfo ] = useFetch((agent) => (
        agent.fetchExperimentVariantPreRemoveInfo({ id: variantId })
    ), [ variantId ]);

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
                    { translate('Really delete this lab workflow?') }
                </b></div>
                <div className='p-3 border bg-white'>
                    { translate('Lab Workflow') } { index + 1}
                    {' - '}
                    { variantsEnum.mapping[variantType] }
                </div>
                <div className='mt-3 d-flex justify-content-end'>
                    <Button variant='danger' onClick={ send.exec }>
                        { translate('Delete') }
                    </Button>
                </div>
            </div>
        ) : (
            <Alert variant='danger'>
                <b>{ translate('There are still appointments with this lab workflow!') }</b>
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

const RemoveVariantModal = WithDefaultModal({
    title: 'Delete Lab Workflow',
    size: 'lg',

    Body: RemoveVariantModalBody
});

export default RemoveVariantModal;
