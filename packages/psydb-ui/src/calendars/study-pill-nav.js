import React from 'react';

import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    LoadingIndicator,
    PillNav,
} from '@mpieva/psydb-ui-layout';

const StudyPillNav = (ps) => {
    var {
        experimentType,
        researchGroupId = undefined,

        selectedStudyId,
        onSelectStudy,
    } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSelectableStudiesForCalendar({
            experimentTypes: [ experimentType ],
            researchGroupId,
        })
    ), [ experimentType, researchGroupId ]);

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
                    { key: null, label: 'Alle' },
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

export default StudyPillNav;
