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
        record
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

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Details/Einladung</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <TabNav
                    items={[
                        {
                            key: 'subjectDetails',
                            label: 'Probanden-Details'
                        },
                        {
                            key: 'scheduleExperiment',
                            label: 'Einladung'
                        }
                    ]}
                    activeKey={ activeMainNavKey }
                    onItemClick={ (nextKey) => {
                        dispatch({ type: 'select-nav-item', payload: {
                            key: nextKey
                        }})
                    }}
                />

                { activeMainNavKey === 'subjectDetails' && (
                    <SubjectModalDetails
                        recordType={ subjectRecordType }
                        id={ record._id }
                    />

                )}

                { activeMainNavKey === 'scheduleExperiment' && (
                    <SubjectModalSchedule
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
                
                { /*<TabNav
                    items={studyNavItems}
                    activeKey={ activeStudyNavKey }
                    onItemClick={ (...args) => {
                        console.log(args);
                    }}
                />*/ }
                


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
