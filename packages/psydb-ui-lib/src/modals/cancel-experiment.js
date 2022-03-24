import React  from 'react';

import {
    Button,
    WithDefaultModal,
    LoadingIndicator,
    Container,
    Pair
} from '@mpieva/psydb-ui-layout';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import { createSend } from '@mpieva/psydb-ui-utils';
import datefns from '../date-fns';

const CancelExperimentModalBody = (ps) => {
    var { onHide, experimentType, experimentId, onSuccessfulUpdate } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExtendedExperimentData({
            experimentType,
            experimentId,
        })
    }, [ experimentId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />;
    }

    var experimentData = fetched.data.experimentData;
    var teamData = fetched.data.opsTeamData;

    var handleSubmit = createSend((formData) => ({
        type: `experiment/cancel-${experimentType}`,
        payload: {
            experimentId,
        }
    }), { onSuccessfulUpdate: [ onHide, onSuccessfulUpdate ] })

    return (
        <div className='mt-3'>
            <div className='bg-white px-3 py-2 border'>
                <header className='pb-1 text-danger'>
                    Termin wirklich absagen?
                </header>
                
                <Container>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(
                                experimentData.record.state.interval.start
                            ),
                            'cccc P'
                        ) }
                    </Pair>
                    <Pair label='Team'>
                        <span className='d-inline-block mr-2' style={{
                            backgroundColor: teamData.record.state.color,
                            height: '24px',
                            width: '24px',
                            verticalAlign: 'bottom',
                        }} />
                        { teamData.record.state.name }
                    </Pair>
                </Container>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button variant='danger'>Absagen</Button>
            </div>
        </div>
    )
}

const CancelExperimentModal = WithDefaultModal({
    title: 'Termin absagen',
    size: 'md',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: CancelExperimentModalBody,
});

export default CancelExperimentModal;
