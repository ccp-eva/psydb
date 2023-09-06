import React, { useState } from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { usePermissions, useRevision } from '@mpieva/psydb-ui-hooks';

import { Modal, TabNav, WithDefaultModal } from '@mpieva/psydb-ui-layout';

import SubjectModalDetails from './subject-modal-details';
import SubjectModalParticipation from './subject-modal-participation';
import SubjectModalSchedule from './subject-modal-schedule';

const SubjectModalBody = (ps) => {
    var {
        onHide,

        inviteType,

        studyData,
        studyNavItems,
        studyRecordType,
        subjectRecordType,
        modalPayloadData,

        onSuccessfulUpdate,
    } = ps;

    var {
        record,
        desiredTestInterval,
        testableInStudies,
    } = modalPayloadData;

    var translate = useUITranslation();
    var permissions = usePermissions();
    var revision = useRevision();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');
    var canReadParticipation = permissions.hasFlag('canReadParticipation');

    var [ activeTab, setActiveTab ] = useState(
        canReadSubjects
        ? 'subjectDetails'
        : 'scheduleExperiment'
    );

    var wrappedOnSuccessfulUpdate = (shouldHide, ...args) => {
        if (shouldHide) {
            onHide();
        }
        else {
            revision.up();
        }
        onSuccessfulUpdate && onSuccessfulUpdate(...args);
    }

    var navItems = [
        (canReadSubjects && {
            key: 'subjectDetails',
            label: translate('Subject Details')
        }),
        (canReadParticipation && {
            key: 'subjectParticipation',
            label: translate('Study Participation')
        }),
        {
            key: 'scheduleExperiment',
            label: translate('Invitation')
        }
    ].filter(it => !!it)

    return (
        <>
            { navItems.length > 1 && (
                <TabNav
                    items={ navItems }
                    activeKey={ activeTab }
                    onItemClick={ (nextKey) => {
                        setActiveTab(nextKey)
                    }}
                />
            )}

            { activeTab === 'subjectDetails' && (
                <SubjectModalDetails
                    recordType={ subjectRecordType }
                    id={ record._id }
                />

            )}
            
            { activeTab === 'subjectParticipation' && (
                <SubjectModalParticipation
                    recordType={ subjectRecordType }
                    id={ record._id }
                />

            )}

            { activeTab === 'scheduleExperiment' && (
                <SubjectModalSchedule
                    inviteType={ inviteType }
                    desiredTestInterval={ desiredTestInterval }
                    testableInStudies={ testableInStudies }

                    revision={ revision.value }
                    studyData={ studyData }
                    studyNavItems={ studyNavItems }
                    subjectId={ record._id }
                    subjectRecordType={ subjectRecordType }
                    subjectLabel={ record._recordLabel }
                    studyRecordType={ studyRecordType }
                    onSuccessfulUpdate={
                        wrappedOnSuccessfulUpdate
                    }
                />
            )}
        </>
    );
}

const SubjectModal = WithDefaultModal({
    Body: SubjectModalBody,

    size: 'xl',
    title: (ps) => {
        var { modalPayloadData: { record }} = ps;
        var translate = useUITranslation();
        return (
            <>
                { translate('Appointment Invitation') }
                {' - '}
                { record._recordLabel }
            </>
        );
    },
    className: 'team-modal',
    backdropClassName: 'team-modal-backdrop',
    bodyClassName: 'bg-light'
});

export default SubjectModal;
