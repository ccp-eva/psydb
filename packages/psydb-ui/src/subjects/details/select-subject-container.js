import React, { useState } from 'react';
import { useHistory } from 'react-router';
import jsonpointer from 'jsonpointer';

import {
    findCRTAgeFrameField,
    calculateAge,
} from '@mpieva/psydb-common-lib';

import {
    useFetch,
    useReadRecord,
    useModalReducer
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    WithDefaultModal,
    LoadingIndicator,
    SplitPartitioned,
    PillNav,
    Alert,
} from '@mpieva/psydb-ui-layout';

import { datefns } from '@mpieva/psydb-ui-lib';

import StudyInhouseLocations from '@mpieva/psydb-ui-lib/src/study-inhouse-locations';

// FIXME
import ExperimentCreateModal from '../../lab-operation/subject-selection/invite/experiment-create-modal'
import ExperimentUpdateModal from '../../lab-operation/subject-selection/invite/experiment-update-modal'

const SelectSubjectContainer = (ps) => {
    var { className, ...pass } = ps;
    var modal = useModalReducer();
    return (
        <>
            <Button
                className={ className }
                onClick={ modal.handleShow }
            >
                in Termin entragen
            </Button>
            <SelectSubjectModal
                { ...modal.passthrough }
                { ...pass }
            />
        </>
    );
};

const SelectSubjectModalBody = (ps) => {
    var {
        onHide,
        subjectId,
        subjectType,
    } = ps;

    var history = useHistory();
    var [ selectedStudy, setSelectedStudy ] = useState();
    
    // TODO
    var [ selectedInviteType, setSelectedInviteType ] = useState('inhouse');

    var [ didFetch, fetched ] = useReadRecord({
        collection: 'subject',
        id: subjectId,
        recordType: subjectType,
        shouldFetchSchema: false,
    });

    if (!didFetch) {
        return <LoadingIndicator />
    }

    var { record, related, crtSettings } = fetched;
    var ageField = findCRTAgeFrameField(crtSettings, { as: 'definition' });

    return (
        <div className='mt-3'>
            <div>
                <b>Proband:in:</b> { record._recordLabel }
                {' '}
                <b>{ ageField.displayName }:</b>
                {' '}
                { datefns.format(
                    new Date(jsonpointer.get(record, ageField.pointer)),
                    'dd.MM.yyyy'
                )}
                {' '}
                <b>Alter:</b>
                {' '}
                { calculateAge({
                    base: jsonpointer.get(record, ageField.pointer),
                    relativeTo: new Date()
                })}
            </div>
            <div className='p-3 border bg-white'>
                <SelectableStudies
                    subjectId={ subjectId }
                    selectedStudy={ selectedStudy }
                    onSelect={ setSelectedStudy }
                />

                <hr />

                <Schedule
                    subjectRecord={ record }
                    selectedStudy={ selectedStudy }
                    inviteType={ selectedInviteType }
                    subjectType={ record.type }
                    onSuccessfulUpdate={ (shouldHide, response) => {
                        var experimentId = response.data.data.find(it => (
                            it.collectionName === 'experiment'
                        )).channelId;
                        history.push(`/experiments/${selectedInviteType}/${experimentId}`)
                    }}
                />
            </div>
        </div>
    );
}

const SelectableStudies = (ps) => {
    var { subjectId, selectedStudy, onSelect } = ps;

    var [ didFetch, fetched, isTransmitting ] = useFetch((agent) => (
        agent.getAxios().post('/api/search-studies-testable-for-subject', {
            subjectId
        })
    ), [ subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <SplitPartitioned partitions={[ 2, 10 ]}>
            <b>Mögl.Studien:</b>
            <PillNav
                items={[
                    ...fetched.data.map(it => ({
                        key: it._id,
                        label: it.state.shorthand
                    }))
                ]}
                activeKey={ selectedStudy?._id }
                onItemClick={ (id) => (
                    onSelect(fetched.data.find(it => it._id === id))
                ) }
            />
        </SplitPartitioned>
    )
}

const Schedule = (ps) => {
    var {
        selectedStudy,
        subjectRecord,
        inviteType,
        testableIntervals,
        revision,
        onSuccessfulUpdate
    } = ps;

    var experimentCreateModal = useModalReducer();
    var experimentUpdateModal = useModalReducer();
    
    var studyId = selectedStudy?._id;
    var studyData = { records: [ selectedStudy ] };
    var subjectId = subjectRecord._id;
    var subjectLabel = subjectRecord._recordLabel;

    return (
        !selectedStudy
        ? (
            <Alert variant='info'>
                <i>Bitten eine Studie wählen</i>
            </Alert>
        )
        : (
            <>
                <ExperimentCreateModal
                    show={ experimentCreateModal.show }
                    onHide={ experimentCreateModal.handleHide }
                    onSuccessfulCreate={ onSuccessfulUpdate }
                    
                    inviteType={ inviteType }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }
                    
                    studyData={ studyData }
                    subjectId={ subjectId }
                    subjectLabel={ subjectLabel }
                    { ...experimentCreateModal.data }
                />

                <ExperimentUpdateModal
                    { ...experimentUpdateModal.passthrough }
                    
                    inviteType={ inviteType }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }

                    studyData={ studyData }
                    subjectId={ subjectId }
                    subjectLabel={ subjectLabel }
                    
                    onSuccessfulUpdate={ onSuccessfulUpdate }
                />
                <StudyInhouseLocations
                    studyId={ selectedStudy._id }
                    studyRecordType={ selectedStudy.type }
                    subjectRecordType={ subjectRecord.type }
                    currentExperimentType={ inviteType }
                    currentSubjectRecord={ subjectRecord }
                    //desiredTestInterval={ desiredTestInterval }
                    testableIntervals={ selectedStudy._testableIntervals }

                    //activeLocationType={ 'instituteroom' }
                    onSelectReservationSlot={ experimentCreateModal.handleShow }
                    onSelectExperimentSlot={ experimentUpdateModal.handleShow}
                    calendarRevision={ revision || 0 }
                    
                    //locationCalendarListClassName='bg-white p-2 border-left border-bottom border-right'
                />
            </>
        )
    );
}

const SelectSubjectModal = WithDefaultModal({
    title: 'Proband:in hinzufügen',
    size: 'xl',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: SelectSubjectModalBody,
});


export default SelectSubjectContainer;
