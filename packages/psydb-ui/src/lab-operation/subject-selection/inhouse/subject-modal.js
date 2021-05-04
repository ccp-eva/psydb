import React, { useState, useEffect, useReducer } from 'react';

import {
    Modal
} from 'react-bootstrap';

import TabNav from '@mpieva/psydb-ui-lib/src/tab-nav';

var reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'select-main-nav':
            return ({
                ...state,
                activeMainNavKey: payload
            })
    }
}

const SubjectModal = ({
    show,
    onHide,
    studyNavItems,
}) => {

    var [ state, dispatch ] = useReducer(reducer, {
        activeMainNavKey: 'subjectDetails',
        activeStudyNavKey: studyNavItems[0].key,
    })

    var {
        activeMainNavKey,
        activeStudyNavKey,
    } = state;

    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Details/Einladung</Modal.Title>
            </Modal.Header>
            <Modal.Body>

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
                    onItemClick={ (...args) => {
                        console.log(args);
                    }}
                />
                
                <TabNav
                    items={studyNavItems}
                    activeKey={ activeStudyNavKey }
                    onItemClick={ (...args) => {
                        console.log(args);
                    }}
                />
                


            </Modal.Body>
        </Modal>
    );
}

export default SubjectModal;
