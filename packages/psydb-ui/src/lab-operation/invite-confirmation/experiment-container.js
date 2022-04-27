import React from 'react';
import { fixRelated } from '@mpieva/psydb-ui-utils';
import { formatDateInterval } from '@mpieva/psydb-ui-lib';

const ExperimentContainer = (ps) => {
    var { record, related, children } = ps;
    related = fixRelated(related, { isResponse: false, labelize: true });

    var { type, state: {
        studyId,
        locationId,
        interval
    }} = record;

    var studyLabel = related.records.study[studyId];
    var locationLabel = related.records.location[locationId];

    var title = getTitle(type);
    var { startDate, startTime, endTime } = formatDateInterval(interval);

    return (
        <div className='border p-3 mb-3 bg-light'>
            <header className='border-bottom mb-2 pb-1'>
                <b>{ getTitle(type)}</b>
            </header>
            <div className='d-flex'>
                <div style={{ minWidth: '150px' }}>
                    <div>{ startDate }</div>
                    <div>
                        <b>{ startTime } - { endTime }</b>
                    </div>
                </div>
                <div style={{ width: '250px' }}>
                    <div>
                        Studie: <b>{ studyLabel }</b>
                    </div>
                    <div>
                        Ort: <b>{ locationLabel}</b>
                    </div>
                    <u>Terminkommentar:</u>
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
            return 'Interner Termin';
        case 'online-video-call':
            return 'Online-Video-Termin';
        default:
            return 'Unbekannter Termin';
    }
}

export default ExperimentContainer;
