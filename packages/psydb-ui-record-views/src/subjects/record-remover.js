import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';
import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
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

    var translate = useUITranslation();

    var send = useSendRemove({
        collection,
        recordType,
        record,
        subChannels: [ 'gdpr', 'scientific' ],
        onSuccessfulUpdate
    });

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchSubjectReverseRefs({
            id
        })
    ), [ id ]);

    var [ didFetchParticipation, fetchedParticipation ] = (
        useFetch((agent) => (
            agent.fetchParticipatedStudiesForSubject({
                subjectId: id,
                onlyParticipated: true,
                extraAxiosConfig: { disableErrorModal: [ 404 ] },
            })
        ), [ id ])
    )

    if (!didFetchRefs || !didFetchParticipation) {
        return <LoadingIndicator size='lg' />
    }
    var { reverseRefs } = fetchedReverseRefs.data;
    var { participationByStudyType } = fetchedParticipation.data;
    var studyTypes = Object.keys(participationByStudyType);

    return (
        <FormBox
            title={ translate('Delete Subject') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Subject') }
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
                        { translate('Subject is referenced by other records!') }
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
                    <hr />
                </>
            )}
            { studyTypes.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Subject has participated in studies!') }
                    </b></Alert>
                    <ParticipationList { ...({
                        participationByStudyType
                    })} />
                    <hr />
                </>
            )}


            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={ reverseRefs.length > 0 || studyTypes.length > 0 }
            >
                { translate('Delete') }
            </Button>
        </FormBox>
    )
}

const ParticipationList = (ps) => {
    var {
        participationByStudyType
    } = ps;

    var translate = useUITranslation();

    var allStudiesById = (
        Object.values(participationByStudyType)
        .reduce((acc, it) => ({
            ...acc,
            ...it.studyRecordsById
        }), {})
    );
    var allParticipation = (
        Object.keys(participationByStudyType)
        .reduce((acc, key) => ([
            ...acc,
            ...participationByStudyType[key].participation.map(it => ({
                ...it,
                studyType: key,
            }))
        ]), [])
    );

    return (
        <div>
            <header className='pb-1 mt-3'><b>
                { translate('Studies') }
            </b></header>
            { allParticipation.map((it, ix) => {
                var { studyType, studyId } = it;
                var study = allStudiesById[studyId];
                var url = `#/studies/${studyType}/${studyId}`;
                return (
                    <div key={ ix }>
                        <a href={ url } target='_blank'>
                            { study._recordLabel }
                        </a>
                    </div>
                )
            })}
        </div>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var translate = useUITranslation();
    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Subject Deleted') }
        >
            <i>
                { translate('Subject was deleted successfully!') }
            </i>
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
