import React from 'react';

import { only, entries } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSend, useSendRemove, usePermissions } from '@mpieva/psydb-ui-hooks';
import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
    AsyncButton,
} from '@mpieva/psydb-ui-layout';

import {
    withRecordRemover,
    FormBox,
    ReverseRefList
} from '@mpieva/psydb-ui-lib';

const SafetyForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record } = fetched;
    var { sequenceNumber, _recordLabel } = record;

    var permissions = usePermissions();
    var [{ translate }] = useI18N();

    var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });
    
    var send_distclean = useSend(() => ({
        type: 'study/remove-distclean',
        payload: { studyId: record._id }
    }), { onSuccessfulUpdate });

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({
            collection,
            id
        })
    ), [ collection, id ]);
    
    var [ didFetchParticipation, fetchedParticipation ] = (
        useFetch((agent) => (
            agent.fetchParticipatedSubjectsForStudy({
                studyId: id,
                onlyParticipated: true,
                extraAxiosConfig: { disableErrorModal: [ 404 ] },
            })
        ), [ id ])
    )

    if (!didFetchRefs || !didFetchParticipation) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;
    var { dataBySubjectType } = fetchedParticipation.data;
    var subjectTypes = Object.keys(dataBySubjectType);

    return (
        <FormBox
            title={ translate('Delete Study') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Study') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <Pair 
                label={ translate('ID No.') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { sequenceNumber }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Study is referenced by other records!') }
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
                    <hr />
                </>
            )}
            { subjectTypes.length > 0 && (
                <>
                    <ParticipationList { ...({
                        dataBySubjectType
                    })} />
                </>
            )}
            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={ reverseRefs.length > 0 }
            >
                { translate('Delete') }
            </Button>

            { permissions.isRoot() && (
                <>
                    <hr />
                    <AsyncButton
                        variant='danger'
                        onClick={ send_distclean.exec }
                        isTransmitting={ send_distclean.isTransmitting }
                    >
                        { translate('DIST CLEAN') }
                    </AsyncButton>
                </>
            )}
        </FormBox>
    )
}

const ParticipationList = (ps) => {
    var {
        dataBySubjectType
    } = ps;

    var [{ translate }] = useI18N();

    var allSubjectsById = {};
    for (var [ subjectType, data ] of entries(dataBySubjectType)) {
        for (var subject of data.records) {
            var { _recordLabel, _id, type } = subject;
            allSubjectsById[subject._id] = {
                _recordLabel, _id, type
            };
        }
    }
    
    if (Object.values(allSubjectsById).length < 1) {
        return null;
    }

    return (
        <div>
            <Alert variant='danger'><b>
                { translate('There exist study participations!') }
            </b></Alert>
            <header className='pb-1 mt-3'><b>
                { translate('Subjects') }
            </b></header>
            { Object.values(allSubjectsById).map((it, ix) => {
                var { _id, _recordLabel, type } = it;
                var url = `#/subjects/${type}/${_id}`;
                return (
                    <div key={ ix }>
                        <a href={ url } target='_blank'>
                            { _recordLabel }
                        </a>
                    </div>
                )
            })}
            <hr />
        </div>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var [{ translate }] = useI18N();
    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Study Deleted') }
        >
            <i>{ translate('Study was deleted successfully!') }</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>{ translate('Back to List') }</b>
                    </a>
                </>
            )}
        </FormBox>
    )
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo
});
