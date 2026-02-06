import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { TabNav } from '@mpieva/psydb-ui-layout';

const StatisticsTabNav = (ps) => {
    var { activeTab, onSwitchTab } = ps;
    var translate = useUITranslation();

    return (
        <TabNav 
            onItemClick={ (nextTab) => (
                onSwitchTab({ nextTab })
            )}
            activeKey={ activeTab }
            className='d-flex media-print-hidden'
            itemClassName='flex-grow'
            items={ tabs.map((it, ix) => ({
                key: it.key,
                label: `${ix + 1}. ${translate(it.label)}`
            })) }
        />
    )
}

const tabs = [
    { key: 'filters', label: '_statistics_filters_tab' },
    { key: 'results', label: '_statistics_results_tab' },
]

export default StatisticsTabNav;
