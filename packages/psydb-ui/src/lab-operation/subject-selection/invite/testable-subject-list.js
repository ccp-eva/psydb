import React, { useState } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import { Base64 } from 'js-base64';

import intervalfns from '@mpieva/psydb-date-interval-fns';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { useUITranslation, useUILocale } from '@mpieva/psydb-ui-contexts';

import {
    useFetch,
    useModalReducer,
    useRevision,
    usePaginationReducer
} from '@mpieva/psydb-ui-hooks';

import {
    Table,
    TableHeadCustomCols,
    LoadingIndicator,
    Pagination,
} from '@mpieva/psydb-ui-layout';

import { datefns, QuickSearch } from '@mpieva/psydb-ui-lib';
import { SubjectRecordViewModal } from '@mpieva/psydb-ui-compositions';

import { convertFilters } from '../convert-filters';

import TableBody from './table-body';
import InviteModal from './subject-modal';
import StudySummaryList from '../study-summary-list';


const InviteTestableSubjectList = (ps) => {
    var {
        inviteType,
        studyLabelItems,
    } = ps;

    if (!['inhouse', 'online-video-call'].includes(inviteType)) {
        throw new Error(`unknown inviteType "${inviteType}"`);
    }

    var translate = useUITranslation();

    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds: joinedStudyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();
    var [ quickSearchFilters, setQuickSearchFilters ] = useState({});

    var studyIds = joinedStudyIds.split(',');

    var userSearchSettings = undefined;
    try {
        userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
    }
    catch (e) {}
    
    //console.log({ userSearchSettings });

    if (!userSearchSettings) {
        return (
            <Redirect to={`${up(url, 1)}`} />
        )
    }

    var { value: revision, up: increaseRevision } = useRevision();

    var pagination = usePaginationReducer();
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            interval,
            filters,
        } = userSearchSettings;

        var { start, end } = interval;

        var doSearch = undefined;
        if (inviteType === 'inhouse') {
            doSearch = agent.searchSubjectsTestableInhouse;
        }
        else if (inviteType === 'online-video-call') {
            doSearch = agent.searchSubjectsTestableInOnlineVideoCall;
        }

        return (
            doSearch({
                subjectTypeKey: subjectRecordType,
                studyTypeKey: studyType,
                studyIds,
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
        )
    }, [
        joinedStudyIds, subjectRecordType, searchSettings64,
        revision, offset, limit, quickSearchFilters
    ])
   
    var inviteModal = useModalReducer();
    var subjectModal = useModalReducer();

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
            <InviteModal
                { ...inviteModal.passthrough }
                
                inviteType={ inviteType }
                subjectRecordType={ subjectRecordType }
               
                studyRecordType={ studyType }
                studyData={ studyData }
                studyNavItems={ studyData.records.map(it => ({
                    key: it._id,
                    label: it.state.shorthand
                })) }
                
                onSuccessfulUpdate={ increaseRevision }
            />

            <SubjectRecordViewModal
                { ...subjectModal.passthrough }
                onSuccessfulUpdate={ increaseRevision }
            />

            <StudySummaryList
                studyTypeKey={ studyType }
                studyIds={ studyIds }
                subjectTypeKey={ subjectRecordType }
                labProcedureTypeKey={ inviteType }
            />

            <DesiredTimeRange interval={ desiredTestInterval}/>

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
                    inviteType,

                    desiredTestInterval,
                    subjectType: subjectRecordType,
                    subjectData,
                    subjectExperimentMetadata,
                    onInviteSubject: inviteModal.handleShow,
                    onViewSubject: subjectModal.handleShow,
                }) } />
            </Table>
        </>
    );
}

const DesiredTimeRange = (ps) => {
    var { interval } = ps;
    
    var translate = useUITranslation();
    var locale = useUILocale();

    var { startDate, endDate } = intervalfns.format(
        interval, { offsetEnd: 0, locale }
    )
    return (
        <div className='border px-3 py-2 mb-3 bg-light'>
            <b>{ translate('Desired Time Range') }:</b>
            {' '}
            { startDate }
            {' '}
            { translate('timerange_to') }
            {' '}
            { endDate }
        </div>
    )
} 

export default InviteTestableSubjectList;
