import React, { useEffect, useReducer, useMemo, useCallback } from 'react';

import {
    Route,
    Switch,
    Redirect,
    useRouteMatch,
    useHistory,
    useParams
} from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';
import {
    LoadingIndicator
} from '@mpieva/psydb-ui-layout';

import InhouseLocationsByType from './inhouse-locations-by-type';

const InhouseLocations = ({
    recordType,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();

    var [ state, dispatch ] = useReducer(reducer, {});
    var {
        revision,

        record,
        relatedRecordLabels,
        relatedHelperSetItems,
        relatedCustomRecordTypeLabels,
    } = state;

    var handleSuccessfulUpdate = useCallback((response) => {
        dispatch({ type: 'increase-revision' });
    }, [])

    useEffect(() => {

        agent.readRecord({
            collection: 'study',
            recordType,
            id,
        })
        .then((response) => {
            dispatch({ type: 'init-data', payload: {
                ...response.data.data
            }})
        })

    }, [ id, revision ])

    if (!record) {
        return (
            <LoadingIndicator size='lg' />
        );
    }

    var { inhouseTestLocationSettings } = record.state;

    return (
        <div className='mt-3 mb-3'>
            { <InhouseLocationsByType { ...({
                settings: inhouseTestLocationSettings,
                onSuccessfulUpdate: handleSuccessfulUpdate,

                record,
                relatedRecordLabels,
                relatedHelperSetItems,
                relatedCustomRecordTypeLabels,
            }) } /> }
        </div>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {

        case 'init-data':
            return ({
                ...state,
                record: payload.record,
                relatedRecordLabels: payload.relatedRecordLabels,
                relatedHelperSetItems: payload.relatedHelperSetItems,
                relatedCustomRecordTypeLabels: payload.relatedCustomRecordTypeLabels,
            })

        case 'increase-revision':
            return ({
                ...state,
                revision: (state.revision || 0) + 1
            })
    }
}

export default InhouseLocations;
