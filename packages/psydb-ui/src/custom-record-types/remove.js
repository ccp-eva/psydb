import React, { useState } from 'react';

import {
    useRouteMatch,
    useParams,
    Switch,
    Route
} from 'react-router-dom';

import { URL, demuxed } from '@mpieva/psydb-ui-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    usePermissions,
    useFetch,
    useSend,
} from '@mpieva/psydb-ui-hooks';

import {
    Pair,
    Button,
    Icons,
    LoadingIndicator,
    Alert,
    NotFound,
    PermissionDenied,
    CRTFieldRefList,
    FormBox,
} from '@mpieva/psydb-ui-layout';

const SafetyForm = (ps) => {
    var {
        id,
        fetched,
        onSuccessfulUpdate
    } = ps;

    var { state: { label }} = fetched.data;

    var translate = useUITranslation();

    var send = useSend(() => ({
        type: 'custom-record-types/remove',
        payload: { id }
    }), { onSuccessfulUpdate });

    var [ didFetchInfo, fetchedInfo ] = useFetch((agent) => (
        agent.fetchCRTPreRemoveInfo({ id })
    ), [ id ]);

    if (!didFetchInfo) {
        return <LoadingIndicator size='lg' />
    }
    var { existingRecordCount, crtFieldRefs } = fetchedInfo.data;

    return (
        <FormBox
            title={ translate('Delete Record Type') }
            titleClassName='text-danger'
        >
            <Pair 
                label={ translate('Record Type') }
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
            </Pair>
            <hr />
            { existingRecordCount > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('There are still records of this record type!') }
                    </b></Alert>
                    <hr />
                </>
            )}
            { crtFieldRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        { translate('This record type is referenced in fields of other record types!') }}
                    </b></Alert>

                    <CRTFieldRefList crtFieldRefs={ crtFieldRefs } />
                    <hr />
                </>
            )}
            <Button
                variant='danger'
                onClick={ send.exec }
                disabled={
                    existingRecordCount > 0
                    || crtFieldRefs.length > 0
                }
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
            title={ translate('Record Type Deleted') }
        >
            <i>{ translate('Record type was deleted successfully!') }</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ URL.hashify(successInfoBackLink) }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>{ translate('Back to List') }</b>
                    </a>
                </>
            )}
        </FormBox>
    )
}

const SafetyFormWrapper = (ps) => {
    var { id } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readCRTSettings({
            id,
            extraAxiosConfig: { disableErrorModal: 404 }
        })
    ), {
        dependencies: [ id ],
    });

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { didReject, errorResponse } = fetched;
    if (didReject) {
        var { status } = errorResponse;
        if (status === 404) {
            return <NotFound />
        }
    }

    return (
        <SafetyForm { ...ps } fetched={ fetched } />
    );
}

const CRTRemover = (ps) => {
    var { id: manualId } = ps;
    var { path } = useRouteMatch();
    var params = useParams();
    var id = manualId || params.id;

    var permissions = usePermissions();
    var canRemove = permissions.hasCollectionFlag(
        'customRecordType', 'remove'
    );
    if (!canRemove) {
        return <PermissionDenied />
    }

    var [ isSuccessful, setIsSuccessful ] = useState(false);
    var { onSuccessfulUpdate, ...pass } = ps;
    return (
        !isSuccessful
        ? <SafetyFormWrapper
            { ...pass }
            id={ id }
            onSuccessfulUpdate={ demuxed([
                () => setIsSuccessful(true),
                onSuccessfulUpdate
            ])}
        />
        : <SuccessInfo { ...ps } id={ id } />
    )
}

export default CRTRemover;
