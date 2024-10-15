import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    formatDateInterval,
    ExperimentDropdown,
} from '@mpieva/psydb-ui-lib';

import {
    MoveExperimentModal,
} from '@mpieva/psydb-ui-lib/src/modals';

const ExperimentContainer = (ps) => {
    var {
        record,
        related,
        children,

        onSuccessfulUpdate
    } = ps;

    related = __fixRelated(related, { isResponse: false, labelize: true });

    var locale = useUILocale();
    var translate = useUITranslation();
    var moveExperimentModal = useModalReducer();

    var { _id, type, state: {
        studyId,
        locationId,
        interval
    }} = record;

    var studyLabel = related.records.study[studyId];
    var locationLabel = related.records.location[locationId];

    var title = getTitle(type);
    var { startDate, startTime, endTime } = formatDateInterval(
        interval, { locale }
    );

    return (
        <div className='border p-3 mb-3 bg-light'>
            
            <MoveExperimentModal { ...({
                show: moveExperimentModal.show,
                onHide: moveExperimentModal.handleHide,
                payloadData: moveExperimentModal.data,

                shouldFetch: true,
                experimentId: _id,
                experimentType: type,

                onSuccessfulUpdate,
            }) } />

            <header className='border-bottom mb-2 pb-1'>
                <b>{ translate(getTitle(type)) }</b>
            </header>
            <div className='d-flex'>
                <div style={{ minWidth: '400px' }}>
                    <div className='d-flex'>
                        <div style={{ minWidth: '150px' }}>
                            <div>{ startDate }</div>
                            <div>
                                <b>{ startTime } - { endTime }</b>
                            </div>
                        </div>
                        <div style={{ width: '250px' }}>
                            <div>
                                { translate('Study') }
                                {': '}
                                <b>{ studyLabel }</b>
                            </div>
                            <div>
                                { translate('Location') }
                                {': '}
                                <b>{ locationLabel }</b>
                            </div>
                        </div>
                    </div>
                    <div className='pr-5'>
                        <hr />
                        <ExperimentDropdown
                            experimentType={ type }
                            detailsLink={`/experiments/${type}/${_id}`}
                            variant='primary'
                            label={ translate('Functions') }
                            
                            onClickMove={ moveExperimentModal.handleShow }
                            enableChangeTeam={ false }
                        />
                    </div>
                </div>

                <div className='flex-grow'>
                    { children }
                </div>
            </div>
        </div>
    )
}

const getTitle = (type) => {
    switch (type) {
        case 'inhouse':
            return 'Inhouse Appointment';
        case 'online-video-call':
            return 'Online Video Appointment';
        default:
            return 'Unknown Appointment Type';
    }
}

export default ExperimentContainer;
