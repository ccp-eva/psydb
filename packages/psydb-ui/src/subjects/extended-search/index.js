import React, { useState } from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    Button,
    LoadingIndicator,
    TabNav,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

import { Filters } from './filters';
import { Results } from './results';

const ExtendedSearch = (ps) => {
    var {
        collection,
        recordType
    } = ps;
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecordSchema({
            collection,
            recordType
        })
    ), [ collection, recordType ]);

    var [ tab, setTab ] = useState('filters');

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var schema = fetched.data;
    var defaultValues = {
        subjectType: recordType,
        customGdprFilters: {},
        customScientificFilters: {},
        specialFilters: {},
        columns: [ '/id' ],
        limit: 0,
        offset: 0
    }; // createDefaults({ schema })

    return (
        <>
            <DefaultForm
                onSubmit={ (formData) => { console.log(formData) }}
                initialValues={ defaultValues }
            >
                {(formikProps) => (
                    <Inner { ...({
                        schema,
                        activeTab: tab,
                        onSwitchTab: setTab,
                        formData: formikProps.values
                    })} />
                )}
            </DefaultForm>
        </>
    );
}

const Inner = (ps) => {
    var {
        activeTab = 'filters',
        onSwitchTab,
        schema,
        formData,
    } = ps;

    var Component = {
        filters: Filters,
        columns: Columns,
        results: Results
    }[activeTab];

    return (
        <>
            <TabNav 
                onItemClick={ onSwitchTab }
                activeKey={ activeTab }
                className='d-flex'
                itemClassName='flex-grow'
                items={[
                    { key: 'filters', label: 'Suchbedingungen' },
                    { key: 'columns', label: 'Spalten' },
                    { key: 'results', label: 'Ergebnisliste' },
                ]}
            />
            <Component
                formData={ formData }
                schema={ schema }
            />
        </>
    );
}

const Columns = (ps) => {
    return (<div />)
}

export default ExtendedSearch;
