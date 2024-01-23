import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator } from '@mpieva/psydb-ui-layout';
import { GenericEnum } from './generic-enum';

export const GenericTypeKey = withField({ Control: (ps) => {
    var { collection, allowedTypes, ...pass } = ps;

    var translate = useUITranslation();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchCollectionCRTs({ collection })
    ), [ collection ]);

    if (!didFetch) {
        return <LoadingIndicator size='select' />
    }
   
    var options = (
        fetched.data.filter(it => (
            !allowedTypes || allowedTypes.includes(it.type)
        )).reduce((acc, it) => ({
            ...acc, [it.type]: translate.crt({ state: it })
        }), {})
    );

    return (
        <GenericEnum.Control
            options={ options }
            { ...pass }
        />
    );
}})
