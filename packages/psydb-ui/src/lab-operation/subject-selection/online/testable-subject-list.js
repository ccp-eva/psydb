import React, { useEffect, useReducer, useMemo, useCallback } from 'react';

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
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    useFetch,
    useRevision,
    useSelectionReducer,
    useModalReducer,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination
} from '@mpieva/psydb-ui-layout';

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

    var subjectModal = useModalReducer();
    var mailInviteModal = useModalReducer();

    var subjectSelection = useSelectionReducer({
        selected: [],
        checkEqual: (existing, payload) => (
            existing._id === payload._id
        )
    });

    var handleSelectSubject = useCallback(({ type, payload }) => {
        subjectSelection[type](payload.record)
    });

    var pagination = usePaginationReducer();
    var { offset, limit, total } = pagination;

    var { value: revision, up: increaseRevision } = useRevision();
    
    // FIXME
    var studyId = studyIds;
    var userSearchSettings = JSON.parse(Base64.decode(searchSettings64));

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }
    
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

    return (
        <>
            <SubjectModal
                { ...subjectModal.passthrough }
                
                studyNavItems={ studyLabelItems }
                studyRecordType={ studyType }
                subjectRecordType={ subjectRecordType }
                onSuccessfulUpdate={ increaseRevision }
            />
            
            <MailInviteModal
                { ...mailInviteModal.passthrough }
        
                totalSubjectCount={ total }
                studyId={ studyId }
                selectedSubjects={ subjectSelection.value }
                previewSubject={ records[0] }
                displayFieldData={ displayFieldData }

                onMailsSend={ increaseRevision }

            />
            
            <div
                className='p-2 d-flex justify-content-between align-items-center'
                style={{
                    position: 'sticky',
                    top: 0,
                    background: '#ffffff',
                }}
            >
                <b>Ausgewählt: { subjectSelection.value.length }</b>

                <Button
                    variant={
                        subjectSelection.value.length < 1
                        ? 'danger'
                        : 'primary'
                    }
                    onClick={ mailInviteModal.handleShow }
                >
                    { 
                        subjectSelection.value.length < 1
                        ? 'Alle Einladen'
                        : 'Gewählte Einladen'
                    }
                </Button>

            </div>

            <Pagination { ...pagination } />

            <Table { ...({
                records,
                displayFieldData,
                relatedRecordLabels,
                relatedHelperSetItems,
               
                showSelectionIndicator: true,
                selectedRecordIds: (
                    subjectSelection.value.map(it => it._id)
                ),
                onSelectRecord: handleSelectSubject,

                CustomActionListComponent,
            }) } />
        
        </>
    );
}

export default OnlineTestableSubjectList;
