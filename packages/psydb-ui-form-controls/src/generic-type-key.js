import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const GenericTypeKey = (ps) => {
    var { collection, allowedTypes, ...pass } = ps;
    var translate = useUITranslation();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection })
    ), [ collection ]);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }

    var options = {};
    for (var it of fetched.data) {
        if (!allowedTypes || allowedTypes.includes(it.type)) {
            options[it.type] = translate.crt({ state: it });
        }
    }

    return (
        <GenericEnum
            options={ options }
            { ...pass }
        />
    );
}
