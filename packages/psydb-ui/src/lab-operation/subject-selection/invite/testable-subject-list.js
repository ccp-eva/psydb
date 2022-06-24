import React, { useEffect, useReducer, useMemo } from 'react';

import {
    Redirect,
    useRouteMatch,
    useParams
} from 'react-router-dom';

import {
    Table
} from 'react-bootstrap';

import { Base64 } from 'js-base64';
import { getSystemTimezone } from '@mpieva/psydb-timezone-helpers';

import agent from '@mpieva/psydb-ui-request-agents';
import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import intervalfns from '@mpieva/psydb-date-interval-fns';
import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    useFetch,
    useModalReducer,
    useRevision,
    usePaginationReducer
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    Pagination,
} from '@mpieva/psydb-ui-layout';

import {
    FieldDataHeadCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import { SubjectRecordViewModal } from '@mpieva/psydb-ui-compositions';

import { convertFilters } from '../convert-filters';

import TableBody from './table-body';
import InviteModal from './subject-modal';
import StudySummaryList from '../study-summary-list';

const InviteTestableSubjectList = ({
    inviteType,
    studyLabelItems,
}) => {
    if (!['inhouse', 'online-video-call'].includes(inviteType)) {
        throw new Error(`unknown inviteType "${inviteType}"`);
    }

    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds: joinedStudyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

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
        revision, offset, limit
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
    } = fetched.data;

    var {
        records,
        displayFieldData,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = subjectData;

    var formattedTestInterval = (
        intervalfns.format(desiredTestInterval, { offsetEnd: 0 })
    );

    return (
        <>
            <InviteModal
                show={ inviteModal.show }
                onHide={ inviteModal.handleHide }
                
                inviteType={ inviteType }
               
                studyData={ studyData }
                studyNavItems={ studyData.records.map(it => ({
                    key: it._id,
                    label: it.state.shorthand
                })) }
                studyRecordType={ studyType }
                
                subjectRecordType={ subjectRecordType }
                subjectModalData={ inviteModal.data }

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

            <div className='border px-3 py-2 mb-3 bg-light'>
                <b>Gewünschter Zeitraum:</b>
                {' '}
                { formattedTestInterval.startDate }
                {' '}
                bis
                {' '}
                { formattedTestInterval.endDate }
            </div>

            <div className='sticky-top border-bottom'>
                <Pagination { ...pagination } />
            </div>


            <Table>
                <thead>
                    <tr>
                        <FieldDataHeadCols { ...({
                            displayFieldData: subjectData.displayFieldData
                        })} />
                        {/*<th>Teilg. Stud.</th>
                        <th>Termine</th>
                        <th>Mögl. Stud.</th>
                        <th />*/}
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

export default InviteTestableSubjectList;
