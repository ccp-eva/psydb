import React, { useMemo } from 'react';

import { TabNav } from '@mpieva/psydb-ui-layout';

const StudyInhouseLocationTypeNav = ({
    studyRecord,
    customRecordTypeData,
    activeType,
    onSelect,
}) => {

    var items = useMemo(() => {
        var { inhouseTestLocationSettings } = studyRecord.state;
        var items = inhouseTestLocationSettings.map(settingsForType => {
            var { customRecordType } = settingsForType;
            var metadata = customRecordTypeData.find(it => {
                return it.type === customRecordType
            });

            return ({
                key: metadata.type,
                label: metadata.state.label,
            });
        });

        return items;
    }, [ studyRecord ])

    return (
        <TabNav
            items={ items }
            activeKey={ activeType }
            onItemClick={ onSelect }
        />
    )
}

export default StudyInhouseLocationTypeNav;
