import React  from 'react';

import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend } from '@mpieva/psydb-ui-hooks';

import {
    Button,
    WithDefaultModal,
    LoadingIndicator,
    Container,
    Pair,
    TeamLabel,
} from '@mpieva/psydb-ui-layout';

import datefns from '../date-fns';

const CancelExperimentModalBody = (ps) => {
    var { onHide, experimentType, experimentId, onSuccessfulUpdate } = ps;

    var translate = useUITranslation();
    var locale = useUILocale();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExtendedExperimentData({
            experimentType,
            experimentId,
        })
    }, [ experimentId ]);

    var send = useSend((formData) => ({
        type: `experiment/cancel-${experimentType}`,
        payload: {
            experimentId,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] })

    if (!didFetch) {
        return <LoadingIndicator size='lg' />;
    }

    var { experimentData, opsTeamData } = fetched.data;

    return (
        <div className='mt-3'>
            <div className='bg-white px-3 py-2 border'>
                <header className='pb-1 text-danger'>
                    { translate('Really cancel the appointment?') }
                </header>
                
                <Container>
                    <Pair label={ translate('Date') }>
                        { datefns.format(
                            new Date(
                                experimentData.record.state.interval.start
                            ),
                            'cccc P', { locale }
                        ) }
                    </Pair>
                    <Pair label={ translate('Team') }>
                        <TeamLabel { ...opsTeamData.record.state } />
                    </Pair>
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button onClick={ send.exec } variant='danger'>
                    { translate('Cancel') }
                </Button>
            </div>
        </div>
    )
}

const CancelExperimentModal = WithDefaultModal({
    title: 'Cancel Appointment',
    size: 'md',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: CancelExperimentModalBody,
});

export default CancelExperimentModal;
