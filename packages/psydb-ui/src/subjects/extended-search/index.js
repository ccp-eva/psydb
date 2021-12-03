import React, { useState } from 'react';
import { Base64 } from 'js-base64';
import { useHistory, useLocation } from 'react-router';

import {
    useFetch,
    useURLSearchParams
} from '@mpieva/psydb-ui-hooks';

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

    var location = useLocation();
    var history = useHistory();
    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { tab: 'filters' }
    });
    var { tab, formData } = query;
    
    var decodedFormData = undefined;
    try {
        if (formData) {
            decodedFormData = JSON.parse(Base64.decode(formData));
        }
    }
    catch (e) {}
    
    var handleSwitchTab = ({ nextTab, formData }) => {
        var formData64 = Base64.encode(JSON.stringify(formData['$']));

        var nextSearchQuery = updateQuery(
            { ...query, tab: nextTab, formData: formData64 },
            { push: false }
        );
        history.replace({
            pathname: location.pathname,
            search: nextSearchQuery
        });
    }

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.readRecordSchema({
            collection,
            recordType
        })
    ), [ collection, recordType ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var schema = fetched.data;
    var defaultValues = decodedFormData || {
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
                        onSwitchTab: handleSwitchTab,
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
                onItemClick={ (nextTab) => (
                    onSwitchTab({ nextTab, formData })
                )}
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
