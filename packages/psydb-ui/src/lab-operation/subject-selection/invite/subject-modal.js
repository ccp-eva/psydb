import React, { useState, useEffect, useReducer } from 'react';
import { usePermissions, useRevision } from '@mpieva/psydb-ui-hooks';

import {
    Modal
} from 'react-bootstrap';

import {
    TabNav
} from '@mpieva/psydb-ui-layout';

import SubjectModalDetails from './subject-modal-details';
import SubjectModalSchedule from './subject-modal-schedule';

const SubjectModal = ({
    show,
    onHide,

    inviteType,

    studyData,
    studyNavItems,
    studyRecordType,
    subjectRecordType,
    subjectModalData,

    onSuccessfulUpdate,
}) => {
    var permissions = usePermissions();
    var revision = useRevision();
    var canReadSubjects = permissions.hasFlag('canReadSubjects');

    var [ state, dispatch ] = useReducer(reducer, {
        activeMainNavKey: (
            canReadSubjects
            ? 'subjectDetails'
            : 'scheduleExperiment'
        ),
    })

    if (!subjectModalData) {
        return null;
    }

    var {
        record,
        desiredTestInterval,
        testableInStudies,
    } = subjectModalData;

    var {
        activeMainNavKey,
    } = state;

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
            label: 'Proband:innen-Details'
        }),
        {
            key: 'scheduleExperiment',
            label: 'Einladung'
        }
    ].filter(it => !!it)

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Termin-Einladung</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>
                { navItems.length > 1 && (
                    <TabNav
                        items={ navItems }
                        activeKey={ activeMainNavKey }
                        onItemClick={ (nextKey) => {
                            dispatch({ type: 'select-nav-item', payload: {
                                key: nextKey
                            }})
                        }}
                    />
                )}

                { activeMainNavKey === 'subjectDetails' && (
                    <SubjectModalDetails
                        recordType={ subjectRecordType }
                        id={ record._id }
                    />

                )}

                { activeMainNavKey === 'scheduleExperiment' && (
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
                
            </Modal.Body>
        </Modal>
    );
}

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'select-nav-item':
            return ({
                ...state,
                activeMainNavKey: payload.key
            })
    }
}

export default SubjectModal;
