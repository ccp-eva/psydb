import React, { useEffect, useReducer, useMemo, useCallback, useState } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { Base64 } from 'js-base64';

import {
    Button
} from 'react-bootstrap';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    useRevision,
    useSelectionReducer,
    useModalReducer,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    TableHeadCustomCols,
    LoadingIndicator,
    Pagination
} from '@mpieva/psydb-ui-layout';

import { datefns, QuickSearch } from '@mpieva/psydb-ui-lib';
import { SubjectRecordViewModal } from '@mpieva/psydb-ui-compositions';

import { convertFilters } from '../convert-filters';

import TableBody from './table-body';
import SubjectModal from './subject-modal';
import MailInviteModal from './mail-invite-modal';

const OnlineTestableSubjectList = ({
    studyLabelItems,
}) => {
    var translate = useUITranslation();
    
    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds: joinedStudyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();
    var [ quickSearchFilters, setQuickSearchFilters ] = useState({});

    // FIXME
    var studyId = joinedStudyIds;

    var subjectModal = useModalReducer();
    var mailInviteModal = useModalReducer();

    var subjectSelection = useSelectionReducer({
        selected: [],
        checkEqual: (existing, payload) => (
            existing._id === payload._id
        )
    });

    var handleSelectSubject = useCallback((record) => {
        subjectSelection.toggle(record)
    });

    var pagination = usePaginationReducer();
    var { offset, limit, total } = pagination;

    var { value: revision, up: increaseRevision } = useRevision();
    
    var userSearchSettings = undefined;
    try {
        userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
    }
    catch (e) {}
    
    console.log({ userSearchSettings });

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            interval,
            filters,
        } = userSearchSettings;

        var { start, end } = interval;

        return (
            agent.searchSubjectsTestableInOnlineSurvey({
                subjectTypeKey: subjectRecordType,
                studyTypeKey: studyType,
                studyIds: joinedStudyIds.split(','),
                interval: {
                    start: datefns.startOfDay(new Date(start)),
                    end: datefns.endOfDay(new Date(end)),
                },
                filters: convertFilters(filters),
                quickSearchFilters,

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
        joinedStudyIds, subjectRecordType, searchSettings64,
        revision, offset, limit, quickSearchFilters
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
    
    var { interval: desiredTestInterval } = userSearchSettings;

    var {
        studyData,
        subjectData,
        subjectExperimentMetadata,
        subjectRecordLabelDefinition,
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
                
                studyNavItems={ studyData.records.map(it => ({
                    key: it._id,
                    label: it.state.shorthand
                })) }
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

            <Table style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead className='sticky-top bg-light'>
                    <tr className='bg-light'>
                        <td className='m-0 p-0' colSpan={
                            subjectData.displayFieldData.length + 6
                        }>
                            <QuickSearch
                                filters={ quickSearchFilters }
                                displayFieldData={
                                    subjectRecordLabelDefinition.tokens
                                }
                                onSubmit={ ({ filters }) => {
                                    setQuickSearchFilters(filters);
                                }}
                            />
                        </td>
                    </tr>
                    <tr className='bg-light'>
                        <td className='m-0 p-0' colSpan={
                            subjectData.displayFieldData.length + 6
                        }>
                            <Pagination { ...pagination } />
                        </td>
                    </tr>
                    <tr className='bg-white'>
                        <th>{ translate('Subject') }</th>
                        <TableHeadCustomCols { ...({
                            definitions: subjectData.displayFieldData
                        })} />
                        <th>{ translate('Age Today') }</th>
                        <th>{ translate('Part. Studies') }</th>
                        <th>{ translate('Appointments') }</th>
                        <th>{ translate('Poss. Studies') }</th>
                        <th />
                    </tr>
                </thead>

                <TableBody { ...({
                    desiredTestInterval,
                    subjectType: subjectRecordType,
                    subjectData,
                    subjectExperimentMetadata,
                    
                    selectedSubjectIds: (
                        subjectSelection.value.map(it => it._id)
                    ),
                    onSelectSubject: handleSelectSubject,

                    //onInviteSubject: inviteModal.handleShow,
                    onViewSubject: subjectModal.handleShow,
                }) } />
            </Table>

        </>
    );
}

export default OnlineTestableSubjectList;
