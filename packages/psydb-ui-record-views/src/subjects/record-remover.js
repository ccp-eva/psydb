import React from 'react';

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

    var send = useSendRemove({
        collection,
        recordType,
        record,
        subChannels: [ 'gdpr', 'scientific' ],
        onSuccessfulUpdate
    });

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({
            collection,
            id
        })
    ), [ collection, id ]);

    var [ didFetchParticipation, fetchedParticipation ] = (
        useFetch((agent) => (
            agent.fetchParticipatedStudiesForSubject({
                subjectId: id,
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
        <FormBox title='Proband löschen' titleClassName='text-danger'>
            <Pair 
                label='Proband'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { _recordLabel }
            </Pair>
            <Pair 
                label='ID Nr.'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { sequenceNumber }
            </Pair>
            <hr />
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Proband wird von anderen Datensätzen referenziert
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
                    <hr />
                </>
            )}
            { studyTypes.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Proband hat an Studien teilgenommen
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
                Löschen
            </Button>
        </FormBox>
    )
}

const ParticipationList = (ps) => {
    var {
        participationByStudyType
    } = ps;

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
                Studien
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
    return (
        <FormBox titleClassName='text-success' title='Proband gelöscht'>
            <i>Proband wurde erfolgreich gelöscht</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ successInfoBackLink }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>zurück zur Liste</b>
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
