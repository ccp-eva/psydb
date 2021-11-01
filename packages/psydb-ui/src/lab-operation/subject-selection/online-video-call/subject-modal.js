import React, { useState, useEffect, useReducer } from 'react';

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
    studyNavItems,
    studyRecordType,
    subjectRecordType,
    subjectModalData,

    onSuccessfulUpdate,
}) => {
    if (!subjectModalData) {
        return null;
    }

    var {
        record
    } = subjectModalData;

    var [ state, dispatch ] = useReducer(reducer, {
        activeMainNavKey: 'subjectDetails',
    })

    var {
        activeMainNavKey,
    } = state;

    var wrappedOnSuccessfulUpdate = (...args) => {
        onHide();
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
