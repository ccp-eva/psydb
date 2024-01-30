import React, { useState } from 'react';
import { Base64 } from 'js-base64';
import { useHistory, useLocation } from 'react-router';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    usePermissions,
    useFetchAll,
    useURLSearchParams
} from '@mpieva/psydb-ui-hooks';

import {
    Button,
    LoadingIndicator,
    TabNav,
    PageWrappers,
} from '@mpieva/psydb-ui-layout';

import {
    FormBox,
    DefaultForm,
    ExtendedSearchFields as Fields
} from '@mpieva/psydb-ui-lib';

import { Filters } from './filters';
import { Columns } from './columns';
import { Results } from './results';

const maybeDecodeBase64 = (encoded, { isJson = true } = {}) => {
    var decoded = undefined;
    try {
        if (encoded) {
            decoded = Base64.decode(encoded);
            if (isJson) {
                decoded = JSON.parse(decoded);
            }
            console.log('decoded base64', decoded);
        }
    }
    catch (e) {}
    return decoded;
}

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

    var schema = fetched.schema.data;
    var crtSettings = fetched.crtSettings.data;

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

    var permissions = usePermissions();

    var location = useLocation();
    var history = useHistory();
    var translate = useUITranslation();

    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { tab: 'filters' }
    });
    var { tab, formData } = query;
    var decodedFormData = maybeDecodeBase64(formData, { isJson: true });
    
    var handleSwitchTab = ({ nextTab, formData }) => {
        //console.log('handleSwitchTab', formData);
        var formData64 = Base64.encode(JSON.stringify(formData));

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

    var defaultColumns = (
        crtSettings.tableDisplayFields
        .filter(it => {
            var out = (
                !crtSettings.commentFieldIsSensitive
                || permissions.hasFlag('canAccessSensitiveFields')
            ) ? (
                true
            ) : (
                it.dataPointer !== '/scientific/state/comment'
            );

            return out;
        })
        .map(it => (
            it.dataPointer
        ))
    );

    console.log(defaultColumns);

    var defaultValues = {
        subjectType: recordType,
        customGdprFilters: {},
        customScientificFilters: {},
        specialFilters: {
            isHidden: 'only-false'
        },
        columns: defaultColumns,
        sort: { column: '/sequenceNumber', direction: 'asc' },
        limit: 0,
        offset: 0,

        ...decodedFormData
    };

    return (
        <PageWrappers.Level3 title={ translate('Advanced Subject Search') }>
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

    var translate = useUITranslation();

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
