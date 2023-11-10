import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

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
        <FormBox
            title={ translate('Delete Subject Group') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Subject Group')}
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { name }
            </Pair>
            <hr />
            { experiments.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Subject group is referenced by study participations!') }
                    </b></Alert>

                    <ExperimentList experiments={ experiments } />
                    <hr />
                </>
            )}
            { reverseRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('Subject group is referenced by other records!') }
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
                { translate('Delete') }
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    var translate = useUITranslation();
    return (
        <FormBox
            titleClassName='text-success'
            title={ translate('Subject Group Deleted') }
        >
            <i>
                { translate('Subject group was deleted successfully!') }
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
