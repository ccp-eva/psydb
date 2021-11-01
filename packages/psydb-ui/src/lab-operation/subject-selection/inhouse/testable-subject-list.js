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

import { convertFilters } from '../convert-filters';

import TableBody from './table-body';
import SubjectModal from './subject-modal';

const InhouseTestableSubjectList = ({
    studyLabelItems,
}) => {
    var { path, url } = useRouteMatch();
    var {
        studyType,
        studyIds: joinedStudyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

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

    var { value: revision, up: increaseRevision } = useRevision();
    
    var pagination = usePaginationReducer();
    var { offset, limit } = pagination;
    
    var [ didFetch, fetched ] = useFetch((agent) => {
        var {
            interval,
            filters,
        } = userSearchSettings['$'];

        var { start, end } = interval;

        return (
            agent.searchTestableSubjectsInhouse({
                subjectTypeKey: subjectRecordType,
                studyTypeKey: studyType,
                studyIds: joinedStudyIds.split(','),
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
   
    var subjectModal = useModalReducer();

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

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

    return (
        <>
            <SubjectModal
                show={ subjectModal.show }
                onHide={ subjectModal.handleHide }
                
                studyNavItems={ studyData.records.map(it => ({
                    key: it._id,
                    label: it.state.shorthand
                })) }
                studyRecordType={ studyType }
                
                subjectRecordType={ subjectRecordType }
                subjectModalData={ subjectModal.data }

                onSuccessfulUpdate={ increaseRevision }
            />

            <Pagination { ...pagination } />

            <Table>
                <thead>
                    <tr>
                        <FieldDataHeadCols { ...({
                            displayFieldData: subjectData.displayFieldData
                        })}/>
                        <th>Teilg. Stud.</th>
                        <th>Termine</th>
                        <th>Mögl. Stud.</th>
                        <th />
                    </tr>
                </thead>

                <TableBody { ...({
                    subjectData,
                    subjectExperimentMetadata,
                    onSelectSubject: subjectModal.handleShow,
                }) } />
            </Table>
        </>
    );
}

export default InhouseTestableSubjectList;
