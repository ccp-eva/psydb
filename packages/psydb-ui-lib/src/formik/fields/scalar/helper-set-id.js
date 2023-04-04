import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const HelperSetId = withField({ Control: (ps) => {
    var { collection, ...pass } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.searchRecords({
            collection: 'helperSet',
            showHidden: true,
            limit: 1000 // FIXME
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }
    
    var options = fetched.data.records.reduce((acc, it) => ({
        ...acc,
        [it._id]: it._recordLabel
    }), {});

    return (
        <GenericEnum.Control
            options={ options }
            { ...pass }
        />
    );
}})
