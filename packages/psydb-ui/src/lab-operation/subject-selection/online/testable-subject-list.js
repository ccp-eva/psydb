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

import LoadingIndicator from '@mpieva/psydb-ui-lib/src/loading-indicator';

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

    var {
        records,
        count,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,

        selectedSubjects,

        showSubjectModal,
        subjectModalData,

        showMailInviteModal,

        listRevision,
    } = state;

    useEffect(
        () => {
            var {
                timeFrame,
                ageFrames,
                values,
            } = userSearchSettings

            agent.searchTestableSubjectsInhouse({
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
            })
            .then((response) => {
                dispatch({ type: 'init', payload: {
                    ...response.data.data
                }});
            })
        }, [ studyIds, subjectRecordType, searchSettings64 ]
    )
    
    var [
        handleShowSubjectModal,
        handleHideSubjectModal,
        
        handleShowMailInviteModal,
        handleHideMailInviteModal,

        handleSelectSubject,
        handleMailsSend,
    ] = useMemo(() => ([
        (selectedRecord) => dispatch({ type: 'show-subject-modal', payload: {
            record: selectedRecord
        }}),
        () => dispatch({ type: 'hide-subject-modal' }),
        () => dispatch({ type: 'show-mail-invite-modal' }),
        () => dispatch({ type: 'hide-mail-invite-modal' }),


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
                    onClick={ () => handleShowSubjectModal(record) }
                >
                    Details
                </Button>
            )
        }
    ), [])

    if (!records) {
        return <LoadingIndicator size='lg' />
    }

    return (
        <>
            <SubjectModal
                show={ showSubjectModal }
                onHide={ handleHideSubjectModal }
                
                studyNavItems={ studyLabelItems }
                studyRecordType={ studyType }
                
                subjectRecordType={ subjectRecordType }
                subjectModalData={ subjectModalData }
            />
            
            <MailInviteModal
                show={ showMailInviteModal }
                onHide={ handleHideMailInviteModal }
        
                totalSubjectCount={ count }

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
                    onClick={ handleShowMailInviteModal }
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
        case 'init':
            var {
                records,
                count,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            } = payload;

            /*displayFieldData.push({
                key: '_testableInSubjects',
                displayName: 'Mögliche Studien',
                type: 'ForeignIdList',
                props: {
                    collection: 'study',
                },
                dataPointer: '/_testableInStudies'
            })*/

            return {
                ...state,
                records,
                count,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
                displayFieldData,
            }

        case 'show-subject-modal':
            return {
                ...state,
                showSubjectModal: true,
                subjectModalData: payload
            }
        case 'hide-subject-modal':
            return {
                ...state,
                showSubjectModal: false,
            }

        case 'show-mail-invite-modal':
            return {
                ...state,
                showMailInviteModal: true,
            }
        case 'hide-mail-invite-modal':
            return {
                ...state,
                showMailInviteModal: false,
            }

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

        case 'increase-list-revision':
            return {
                ...state,
                listRevision: (state.listRevision || 0) + 1
            }
    }
}
        
export default OnlineTestableSubjectList;
