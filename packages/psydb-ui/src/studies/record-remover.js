import React from 'react';

import { only, entries } from '@mpieva/psydb-core-utils';
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
        <FormBox title='Studie löschen' titleClassName='text-danger'>
            <Pair 
                label='Studie'
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
                        Studie wird von anderen Datensätzen referenziert
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
                Löschen
            </Button>
        </FormBox>
    )
}

const ParticipationList = (ps) => {
    var {
        dataBySubjectType
    } = ps;

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
                Es existieren Studen-Teilnahmen
            </b></Alert>
            <header className='pb-1 mt-3'><b>
                Proband:innen
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
    return (
        <FormBox titleClassName='text-success' title='Studie gelöscht'>
            <i>Studie wurde erfolgreich gelöscht</i>
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
