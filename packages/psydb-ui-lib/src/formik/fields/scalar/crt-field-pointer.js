import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { sift } from '@mpieva/psydb-common-lib';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const CRTFieldPointer = withField({ Control: (ps) => {
    var { collection, recordType, filter, ...pass } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        (collection && recordType)
        ? agent.readCRTSettings({ collection, recordType })
        : undefined
    ), [ collection, recordType ]);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }

    if (fetched.data === undefined) {
        return (
            <GenericEnum.Control
                options={{}}
                { ...pass }
            />
        );
    }

    var filterFN = undefined;
    if (filter) {
        filterFN = sift(filter);
    }

    var { hasSubChannels, fieldDefinitions } = fetched.data;
    var options = {};
    if (hasSubChannels) {
        for (var subChannel of Object.keys(fieldDefinitions)) {
            for (var it of fieldDefinitions[subChannel]) {
                if (filterFN ? filterFN(it) : true) {
                    options[it.pointer] = it.displayName;
                }
            }
        } 
    }
    else {
        for (var it of fieldDefinitions) {
            if (filterFN ? filterFN(it) : true) {
                options[it.pointer] = it.displayName;
            }
        }
    }
    
    return (
        <GenericEnum.Control
            options={ options }
            { ...pass }
        />
    );
}})
