import React from 'react';
import { SmartArray } from '@mpieva/psydb-common-lib';
import { useUITranslation, useUILanguage } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const GenericTypeKey = (ps) => {
    var {
        value,
        collection,
        allowedTypes,
        existingTypes = [],
        ignoreResearchGroups = false,
        ...pass
    } = ps;

    var [ language ] = useUILanguage();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchAvailableCRTs({
            collections: [ collection ],
        })
    ), [ collection ]);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }

    var { crts } = fetched.data;
    
    var options = crts.filter({
        $or: [
            { 'type': value },
            { $and: SmartArray([
                ( allowedTypes && { 'type': { $in: allowedTypes }} ),
                { 'type': { $nin: existingTypes }}
            ])}
        ]
    }).asOptions({ language });

    return (
        <GenericEnum
            value={ value }
            options={ options }
            { ...pass }
        />
    );
}
