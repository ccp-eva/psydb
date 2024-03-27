import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend, useRevision } from '@mpieva/psydb-ui-hooks';
import { Alert, LoadingIndicator, NarrowHR } from '@mpieva/psydb-ui-layout';
import { 
    CalendarNav,
    withDailyCalendarPages
} from '@mpieva/psydb-ui-lib';

import InviteConfirmationListItem from './invite-confirmation-list-item';


const InviteConfirmationList = (ps) => {
    var {
        currentPageStart,
        currentPageEnd,
        onPageChange,
    } = ps;

    var { path, url } = useRouteMatch();

    var {
        studyType,
        subjectType,
        researchGroupId,
    } = useParams();

    var translate = useUITranslation();
    var revision = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchInviteConfirmationList({
            subjectRecordType: subjectType,
            researchGroupId,
            start: currentPageStart,
            end: currentPageEnd,
        })
    ), [
        studyType, subjectType, researchGroupId,
        currentPageStart, currentPageEnd, revision.value
    ]);

    var send = useSend((bag) => ({
        type: 'experiment/change-invitation-status',
        payload: {
            experimentId: bag.experimentRecord._id,
            subjectId: bag.subjectRecord._id,
            invitationStatus: bag.status
        }
    }), {
        onSuccessfulUpdate: revision.up
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        experimentRecords,
        experimentOperatorTeamRecords,
        experimentRelated,
        subjectRecordsById,
        subjectRelated,
        subjectDisplayFieldData,
        phoneField,
        studyRecords,
    } = fetched.data;

    var studyRecordsById = keyBy({
        items: studyRecords,
        byProp: '_id'
    });

    return (
        <div>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />

            <NarrowHR />

            { experimentRecords.length < 1 && (
                <Alert variant='info'><i>
                    { translate('No unconfirmed appointments on this day.') }
                </i></Alert>
            )}

            { experimentRecords.map(it => (
                <InviteConfirmationListItem { ...({
                    key: it._id,
                    experimentRecord: it,
                    experimentOperatorTeamRecords,
                    experimentRelated,
                    subjectRecordsById,
                    subjectRelated,
                    subjectDisplayFieldData,
                    phoneField,
                    studyRecord: studyRecordsById[it.state.studyId],

                    onChangeStatus: send.exec,
                    onSuccessfulUpdate: revision.up
                }) } />
            )) }
        </div>
    )
}

const WrappedInviteConfirmationList = (
    withDailyCalendarPages(InviteConfirmationList, {
        withURLSearchParams: true
    })
);

export default WrappedInviteConfirmationList;
