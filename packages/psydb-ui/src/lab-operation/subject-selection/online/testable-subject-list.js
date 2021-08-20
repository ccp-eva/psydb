import React, { useEffect, useReducer, useMemo } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { Base64 } from 'js-base64';

import {
    Button
} from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import up from '@mpieva/psydb-ui-lib/src/url-up';


import useFetch from '@mpieva/psydb-ui-lib/src/use-fetch';
import useModalReducer from '@mpieva/psydb-ui-lib/src/use-modal-reducer';
import useRevision from '@mpieva/psydb-ui-lib/src/use-revision';
import usePaginationReducer from '@mpieva/psydb-ui-lib/src/use-pagination-reducer';

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';
import Pagination from '@mpieva/psydb-ui-lib/src/pagination';

import {
    Table
} from '@mpieva/psydb-ui-lib/src/record-list';

import SubjectModal from './subject-modal';
import MailInviteModal from './mail-invite-modal';

const OnlineTestableSubjectList = ({
    studyLabelItems,
}) => {
    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    // FIXME
    var studyId = studyIds;

    var userSearchSettings = JSON.parse(Base64.decode(searchSettings64));

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var [ state, dispatch ] = useReducer(reducer, {
        selectedSubjects: [],
    });

    var [ revision, increaseRevision ] = useRevision();
    
    var pagination = usePaginationReducer();
    var { offset, limit, total } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            timeFrame,
            ageFrames,
            values,
        } = userSearchSettings

        return (
            agent.searchSubjectsTestableOnline({
                studyRecordType: studyType,
                subjectRecordType,
                studyIds: studyIds.split(','),
                timeFrameStart: datefns.startOfDay(
                    userSearchSettings.timeFrame.start
                ),
                timeFrameEnd: datefns.endOfDay(
                    userSearchSettings.timeFrame.end
                ),
                enabledAgeFrames: ageFrames,
                enabledValues: values,
            
                offset,
                limit,
            })
            .then((response) => {
                pagination.setTotal(
                    response.data.data.subjectData.count
                );
                return response;
            })
        );
    }, [
        studyIds, subjectRecordType, searchSettings64,
        revision, offset, limit
    ])
   
    var subjectModal = useModalReducer();
    var mailInviteModal = useModalReducer();

    var [
        handleSelectSubject,
        handleMailsSend,
    ] = useMemo(() => ([
        ({ type, payload }) => {
            dispatch({
                type: `selected-subjects/${type}`,
                payload
            });
        },
        () => dispatch({ type: 'increase-list-revision' }),
    ]));

    var CustomActionListComponent = useMemo(() => (
        ({ record }) => {
            return (
                <Button
                    size='sm'
                    onClick={ () => subjectModal.handleShow({ record }) }
                >
                    Details
                </Button>
            )
        }
    ), [])

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        subjectData,
        subjectExperimentMetadata,
    } = fetched.data;

    var {
        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = subjectData;

    var {
        selectedSubjects,
    } = state;

    return (
        <>
            <SubjectModal
                show={ subjectModal.show }
                onHide={ subjectModal.handleHide }
                
                studyNavItems={ studyLabelItems }
                studyRecordType={ studyType }
                
                subjectRecordType={ subjectRecordType }
                subjectModalData={ subjectModal.data }
                
                onSuccessfulUpdate={ increaseRevision }
            />
            
            <MailInviteModal
                show={ mailInviteModal.show }
                onHide={ mailInviteModal.handleHide }
        
                totalSubjectCount={ total }

                studyId={ studyId }
                selectedSubjects={ selectedSubjects }
                previewSubject={ records[0] }
                displayFieldData={ displayFieldData }

                onMailsSend={ handleMailsSend }

            />
            
            <div
                className='p-2 d-flex justify-content-between align-items-center'
                style={{
                    position: 'sticky',
                    top: 0,
                    background: '#ffffff',
                }}
            >
                <b>Ausgewählt: { selectedSubjects.length }</b>

                <Button
                    variant={
                        selectedSubjects.length < 1
                        ? 'danger'
                        : 'primary'
                    }
                    onClick={ mailInviteModal.handleShow }
                >
                    { 
                        selectedSubjects.length < 1
                        ? 'Alle Einladen'
                        : 'Gewählte Einladen'
                    }
                </Button>

            </div>

            <Table { ...({
                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
               
                showSelectionIndicator: true,
                selectedRecordIds: (
                    selectedSubjects.map(it => it._id)
                ),
                onSelectRecord: handleSelectSubject,

                CustomActionListComponent,
            }) } />
        
        </>
    );
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'selected-subjects/set':
            return ({
                ...state,
                selectedSubjects: [ payload.record ]
            })
        case 'selected-subjects/add':
            var nextSelectedSubjects = [
                ...state.selectedSubjects,
                payload.record,
            ];
            return ({
                ...state,
                selectedSubjects: nextSelectedSubjects
            });
        case 'selected-subjects/remove':
            var nextSelectedSubjects = state.selectedSubjects.filter(it => (
                it._id !== payload.id
            ));
            return ({
                ...state,
                selectedSubjects: nextSelectedSubjects
            });
    }
}
        
export default OnlineTestableSubjectList;
