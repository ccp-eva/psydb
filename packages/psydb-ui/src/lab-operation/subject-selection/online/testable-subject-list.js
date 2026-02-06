import React, { useMemo, useCallback, useState } from 'react';
import { __fixRelated, __fixDefinitions } from '@mpieva/psydb-common-compat';
import { useI18N } from '@mpieva/psydb-ui-contexts';

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
    useRevision,
    useSelectionReducer,
    useModalReducer,
    usePaginationReducer,
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    Table,
    LoadingIndicator,
    Pagination
} from '@mpieva/psydb-ui-layout';

import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';

import { datefns, QuickSearch } from '@mpieva/psydb-ui-lib';
import { SubjectRecordViewModal } from '@mpieva/psydb-ui-compositions';

import { convertFilters } from '../convert-filters';

import TableBody from './table-body';
import SubjectModal from './subject-modal';
import MailInviteModal from './mail-invite-modal';
import ExtraFunctionBar from './extra-function-bar';

const OnlineTestableSubjectList = (ps) => {
    var { studyLabelItems } = ps;
    
    var { path, url } = useRouteMatch();
    var [{ translate }] = useI18N();

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
   
    var {
        interval,
        filters,
    } = userSearchSettings;

    var { start, end } = interval;

    var fetchBag = {
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
    }

    var [ didFetch, fetched ] = useFetch((agent) => {
        return (
            agent.searchSubjectsTestableInOnlineSurvey(fetchBag)
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

    // FIXME
    subjectData = __fixRelated(subjectData);
    subjectData.definitions = __fixDefinitions(subjectData.displayFieldData);

    var {
        records,
        related,
        definitions,
        
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
                fallbackPreviewSubject={ records[0] }
                displayFieldData={ displayFieldData }

                onMailsSend={ increaseRevision }

            />
           
            <ExtraFunctionBar
                subjectSelection={ subjectSelection }
                onClickInvite={ mailInviteModal.handleShow }
                fetchBag={ fetchBag }
            />

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
                        <TableHeadCustomCols definitions={ definitions } />
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
