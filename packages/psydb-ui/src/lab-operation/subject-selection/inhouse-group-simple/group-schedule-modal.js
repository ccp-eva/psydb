import React, { useState } from 'react';

import {
    WithDefaultModal,
    Button,
    LoadingIndicator,
    TabNav,
} from '@mpieva/psydb-ui-layout';

import {
    useFetch,
    useModalReducer
} from '@mpieva/psydb-ui-hooks';

import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

const Details = (ps) => {
    var { subjectGroupId } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecord({
            collection: 'subjectGroup',
            id: subjectGroupId
        })
    ), [ subjectGroupId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, ...related } = fetched.data;

    return (
        <div>{ record.state.name } - DETAILS (TODO)</div>
    );
}

const ScheduleExperiment = (ps) => {
    var { subjectGroupId, studyIds } = ps;
    
    var [ studyId, setStudyId ] = useState(studyIds[0]);
    var experimentCreateModal = useModalReducer();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecord({ collection: 'study', id: studyId })
    ), [ studyId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { record, ...related } = fetched.data;

    return (
        <>
            <StudyInhouseLocations
                studyId={ studyId }
                studyRecordType={ record.type }
                currentExperimentType='inhouse-group-simple'

                //activeLocationType={ 'instituteroom' }
                onSelectEmptySlot={ experimentCreateModal.handleShow }
                calendarRevision={ 0 }
                
                locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
            />
        </>
    )
}

const ScheduleGroupModalBody = (ps) => {
    var {
        studyIds,
        modalPayloadData,
        onHide,
        onSuccessfulUpdate
    } = ps;

    var { record } = modalPayloadData;

    var [ activeTab, setActiveTab ] = useState('details');

    var navItems = [
        {
            key: 'details',
            label: 'Gruppen-Details'
        },
        {
            key: 'scheduleExperiment',
            label: 'Termin'
        }
    ];

    return (
        <>
            <TabNav
                items={ navItems }
                activeKey={ activeTab }
                onItemClick={ (nextKey) => setActiveTab(nextKey)}
            />
            <div className='mt-3'>
                { activeTab === 'details' && (
                    <Details subjectGroupId={ record._id } />
                )}
                { activeTab === 'scheduleExperiment' && (
                    <ScheduleExperiment
                        studyIds={ studyIds }
                        subjectGroupId={ record._id }
                    />
                )}
            </div>
        </>
    );
}

const ScheduleGroupModal = WithDefaultModal({
    title: 'Termin für Gruppe',
    size: 'xl',

    Body: ScheduleGroupModalBody
});

export default ScheduleGroupModal;
