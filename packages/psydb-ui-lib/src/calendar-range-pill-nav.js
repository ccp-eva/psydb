import React from 'react';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { PillNav } from '@mpieva/psydb-ui-layout';

export const CalendarRangePillNav = ({
    selectedVariant,
    onSelectVariant,
}) => {
    var translate = useUITranslation();

    return (
        <div>
            <PillNav
                items={[
                    { key: 'daily', label: translate('Day') },
                    { key: '3-day', label: translate('3-Day') },
                    { key: 'weekly', label: translate('Week') },
                ]}
                activeKey={ selectedVariant  }
                onItemClick={ onSelectVariant }
            />
        </div>
    )
};
