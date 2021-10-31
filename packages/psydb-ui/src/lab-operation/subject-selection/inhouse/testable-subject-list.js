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
        studyIds,
        subjectRecordType,
        searchSettings64
    } = useParams();

    var userSearchSettings = JSON.parse(Base64.decode(searchSettings64));
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
                interval: {
                    start: datefns.startOfDay(start),
                    end: datefns.endOfDay(end),
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
        studyIds, subjectRecordType, searchSettings64,
        revision, offset, limit
    ])
   
    var subjectModal = useModalReducer();

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
                show={ subjectModal.show }
                onHide={ subjectModal.handleHide }
                
                studyNavItems={ studyLabelItems }
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
