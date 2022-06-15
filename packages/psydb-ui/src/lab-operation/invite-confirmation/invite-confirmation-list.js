import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { useFetch, useSend, useRevision } from '@mpieva/psydb-ui-hooks';
import { Alert, LoadingIndicator } from '@mpieva/psydb-ui-layout';
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
        phoneListField,
    } = fetched.data;

    return (
        <div>
            <CalendarNav { ...({
                className: 'mt-3',
                currentPageStart,
                currentPageEnd,
                onPageChange,
            })} />

            <hr className='mt-1 mb-3' style={{
                marginLeft: '15em',
                marginRight: '15em',
            }}/>

            { experimentRecords.length < 1 && (
                <Alert variant='info'>
                    <i>
                        Keine offenen Terminbestätigungen
                        an diesem Tag
                    </i>
                </Alert>
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
                    phoneListField,

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
