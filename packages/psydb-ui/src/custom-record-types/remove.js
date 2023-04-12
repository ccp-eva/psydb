import React, { useState } from 'react';

import {
    useRouteMatch,
    useParams,
    Switch,
    Route
} from 'react-router-dom';

import { URL, demuxed } from '@mpieva/psydb-ui-utils';

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
        <FormBox title='Datensatz-Typ löschen' titleClassName='text-danger'>
            <Pair 
                label='Datensatz-Typ'
                wLeft={ 3 } wRight={ 9 } className='px-3'
            >
                { label }
            </Pair>
            <hr />
            { existingRecordCount > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Es existieren noch Einträge für diesen Datensatz-Typ
                    </b></Alert>
                    <hr />
                </>
            )}
            { crtFieldRefs.length > 0 && (
                <>
                    <Alert variant='danger'><b>
                        Datensatz-Typ wird von Feldern
                        in anderen Datensatztypen referenziert
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
                Löschen
            </Button>
        </FormBox>
    )
}

const SuccessInfo = (ps) => {
    var { successInfoBackLink } = ps;
    return (
        <FormBox titleClassName='text-success' title='Datensatz-Typ gelöscht'>
            <i>Datensatz-Typ wurde erfolgreich gelöscht</i>
            { successInfoBackLink && (
                <>
                    <hr />
                    <a href={ URL.hashify(successInfoBackLink) }>
                        <Icons.ArrowLeftShort />
                        {' '}
                        <b>zurück zur Liste</b>
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
