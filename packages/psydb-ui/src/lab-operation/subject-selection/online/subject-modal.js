import React, { useState, useEffect, useReducer } from 'react';

import {
    Modal
} from 'react-bootstrap';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';
import SubjectModalDetails from './subject-modal-details';

const SubjectModal = ({
    show,
    onHide,
    studyRecordType,
    subjectRecordType,
    subjectModalData,
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

    return (
        <Modal
            show={show}
            onHide={ onHide }
            size='xl'
            className='team-modal'
            backdropClassName='team-modal-backdrop'
        >
            <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-light'>

                <SubjectModalDetails
                    recordType={ subjectRecordType }
                    id={ record._id }
                />


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
