import React from 'react';

import { PillNav } from '@mpieva/psydb-ui-layout';

export const CalendarRangePillNav = ({
    selectedVariant,
    onSelectVariant,
}) => {
    return (
        <div>
            <PillNav
                items={[
                    { key: 'daily', label: 'Tag' },
                    { key: '3-day', label: '3-Tage' },
                    { key: 'weekly', label: 'Woche' },
                ]}
                activeKey={ selectedVariant  }
                onItemClick={ onSelectVariant }
            />
        </div>
    )
};
