import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { JsonBase64 } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useURLSearchParams } from '@mpieva/psydb-ui-hooks';
import { TabNav, PageWrappers } from '@mpieva/psydb-ui-layout';
import { DefaultForm } from '@mpieva/psydb-ui-lib';

import { Filters } from './filters';
import { Columns } from './columns';
import { Results } from './results';

// NOTE: experiments have no custom record types, so unlike
// subjects/studies/locations there is no crt settings to fetch
const ExtendedSearch = (ps) => {
    var location = useLocation();
    var history = useHistory();
    var [{ translate }] = useI18N();

    var [ query, updateQuery ] = useURLSearchParams({
        defaults: { tab: 'filters' }
    });
    var { tab, formData } = query;
    var decodedFormData = JsonBase64.decode(formData);
    
    var handleSwitchTab = ({ nextTab, formData }) => {
        var formData64 = JsonBase64.encode(formData);

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

    var defaultValues = {
        specialFilters: {
            isCanceled: 'only-false',
            isPostprocessed: 'any',
        },
        columns: [
            '/type',
            '/state/interval/start',
            '/state/studyId',
            '/state/locationId',
            '/state/selectedSubjectIds',
        ],
        sort: { column: '/state/interval/start', direction: 'desc' },
        limit: 0,
        offset: 0,

        ...decodedFormData
    };

    return (
        <PageWrappers.Level2 title={ translate('Advanced Participation Search') }>
            <DefaultForm
                onSubmit={ (formData) => { handleSwitchTab({
                    nextTab: getNextTabKey(tab),
                    formData,
                }) }}
                initialValues={ defaultValues }
            >
                {(formikProps) => (
                    <Inner { ...({
                        activeTab: tab,
                        onSwitchTab: handleSwitchTab,
                        formData: formikProps.values['$']
                    })} />
                )}
            </DefaultForm>
        </PageWrappers.Level2>
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
            <Component formData={ formData } />
        </>
    );
}

export default ExtendedSearch;
