import React from 'react';
import { useFetch, useSendRemove } from '@mpieva/psydb-ui-hooks';
import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
    CRTFieldRefList,
    FormBox,
} from '@mpieva/psydb-ui-layout';

import {
    withRecordRemover,
    ReverseRefList,
} from '@mpieva/psydb-ui-lib';

import formatInterval from '@mpieva/psydb-ui-lib/src/format-date-interval';

const SafetyForm = (ps) => {
    var {
        collection,
        recordType,
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { record } = fetched;
    var { state: { name }} = record;

    var send = useSendRemove({
        collection,
        recordType,
        record,
        onSuccessfulUpdate
    });

    var [ didFetchInfo, fetchedInfo ] = useFetch((agent) => (
        agent.fetchSubjectGroupPreRemoveInfo({ id })
    ), [ id ]);

    if (!didFetchInfo) {
        return <LoadingIndicator size='lg' />
    }
    var { canRemove, experiments, reverseRefs } = fetchedInfo.data;

    return (
        <FormBox title='Proband:innen-Gruppe löschen' titleClassName='text-danger'>
            <Pair 
                label='Proband:innen-Gruppe'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { name }
            </Pair>
            <hr />
            { experiments.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Gruppe in Studienteilnahmen referenziert
                    </b></Alert>

                    <ExperimentList experiments={ experiments } />
                    <hr />
                </>
            )}
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Gruppe wird von anderen Datensätzen referenziert
                    </b></Alert>

                    <ReverseRefList reverseRefs={ reverseRefs } />
                    <hr />
                </>
            )}
            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={ !canRemove }
            >
                Löschen
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <FormBox titleClassName='text-success' title='Proband:innen-Gruppe gelöscht'>
            <i>Proband:innen-Gruppe wurde erfolgreich gelöscht</i>
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

const ExperimentList = (ps) => {
    var { experiments } = ps;
    return (
        experiments.map((it, ix) => {
            var { _id, type, realType, state: { interval }} = it;
            type = realType || type;

            var styleBag = (
                ix === 0
                ? { className: 'd-inline-block' }
                : {
                    className: 'd-inline-block ml-2 pl-2',
                    style: { borderLeft: '1px solid black' }
                }
            );

            var url = `#/experiments/${type}/${_id}`;
            var { startDate } = formatInterval(interval);

            return (
                <span { ...styleBag }>
                    <a href={ url }>{ startDate }</a>
                </span>
            )
        })
    );
}

export const RecordRemover = withRecordRemover({
    SafetyForm,
    SuccessInfo,
    urlIdParam: 'id',
});
