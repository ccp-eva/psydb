import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { JsonBase64 } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';

import { useFetchAll, useURLSearchParams } from '@mpieva/psydb-ui-hooks';

import { LoadingIndicator, TabNav, PageWrappers }
    from '@mpieva/psydb-ui-layout';

import { DefaultForm } from '@mpieva/psydb-ui-lib';

import { Filters } from './filters';
import { Columns } from './columns';
import { Results } from './results';

const ExtendedSearchDataWrapper = (ps) => {
    var {
        collection,
        recordType
    } = ps;
    
    var [ didFetch, fetched ] = useFetchAll((agent) => ({
        crtSettings: agent.readCRTSettings({
            collection, recordType
        }),
        schema: agent.readRecordSchema({
            collection,
            recordType
        })
    }), [ collection, recordType ])


    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { schema, crtSettings } = fetched._stageDatas

    return (
        <ExtendedSearch
            schema={ schema }
            crtSettings={ crtSettings }
            { ...ps }
        />
    )
}

const ExtendedSearch = (ps) => {
    var {
        collection,
        recordType,
        schema,
        crtSettings,
    } = ps;
    var { fieldDefinitions } = crtSettings;

    var location = useLocation();
    var history = useHistory();
    var [{ translate }] = useI18N();

    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { tab: 'filters' }
    });
    var { tab, formData } = query;
    // NOTE: the previous implementation wasnt url safe so ill keep that
    var decodedFormData = JsonBase64.decode(formData, { urlSafe: false });
    
    var handleSwitchTab = ({ nextTab, formData }) => {
        // NOTE: the previous implementation wasnt url safe so ill keep that
        var formData64 = JsonBase64.encode(formData, { urlSafe: false });

        var nextSearchQuery = updateQuery(
            { ...query, tab: nextTab, formData: formData64 },
            { push: false }
        );
        history.replace({
            pathname: location.pathname,
            search: nextSearchQuery
        });
        window.scrollTo(0, 0);
    }

    var defaultColumns = crtSettings.tableDisplayFields.map(it => (
        it.dataPointer
    ));

    var defaultValues = {
        studyType: recordType,
        customFilters: {},
        specialFilters: {
            isHidden: 'only-false'
        },
        columns: defaultColumns,
        sort: { column: '/sequenceNumber', direction: 'asc' },
        limit: 0,
        offset: 0,

        ...decodedFormData
    }; // createDefaults({ schema })

    return (
        <PageWrappers.Level3 title={ translate('Advanced Study Search') }>
            <DefaultForm
                onSubmit={ (formData) => { handleSwitchTab({
                    nextTab: getNextTabKey(tab),
                    formData,
                }) }}
                initialValues={ defaultValues }
            >
                {(formikProps) => (
                    <Inner { ...({
                        crtSettings,
                        schema,
                        activeTab: tab,
                        onSwitchTab: handleSwitchTab,
                        formData: formikProps.values['$']
                    })} />
                )}
            </DefaultForm>
        </PageWrappers.Level3>
    );
}

const tabs = [
    { key: 'filters', label: '_extended_search_filters_tab' },
    { key: 'columns', label: '_extended_search_columns_tab' },
    { key: 'results', label: '_extended_search_results_tab' },
]

const getNextTabKey = (current) => {
    var index = tabs.findIndex(it => it.key === current);
    var next = tabs[index + 1];
    if (!next) {
        throw new Error(`cannot find next tab for "${current}"`)
    }
    return next.key;
}

const Inner = (ps) => {
    var {
        activeTab = 'filters',
        onSwitchTab,
        crtSettings,
        schema,
        formData,
    } = ps;

    var [{ translate }] = useI18N();

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
                className='d-flex media-print-hidden'
                itemClassName='flex-grow'
                items={ tabs.map((it, ix) => ({
                    key: it.key,
                    label: `${ix + 1}. ${translate(it.label)}`
                })) }
            />
            <Component
                formData={ formData }
                crtSettings={ crtSettings }
                schema={ schema }
            />
        </>
    );
}


export default ExtendedSearchDataWrapper;
