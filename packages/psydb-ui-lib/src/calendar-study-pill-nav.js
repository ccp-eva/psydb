import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    PillNav,
} from '@mpieva/psydb-ui-layout';

export const CalendarStudyPillNav = (ps) => {
    var {
        experimentTypes,
        researchGroupId = undefined,

        selectedStudyId,
        onSelectStudy,
    } = ps;

    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSelectableStudiesForCalendar({
            experimentTypes,
            researchGroupId,
        })
    ), [ experimentTypes.join(','), researchGroupId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records } = fetched.data;

    return (
        <div>
            <PillNav
                items={[
                    // FIXME: key cannot be undefined but null
                    // works w/o warnings
                    { key: null, label: translate('All') },
                    ...records.map(it => ({
                        key: it._id,
                        label: it._recordLabel
                    }))
                ]}
                activeKey={ selectedStudyId  }
                onItemClick={ onSelectStudy }
            />
        </div>
    )
};
