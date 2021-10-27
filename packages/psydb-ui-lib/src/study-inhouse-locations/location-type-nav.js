import React, { useMemo } from 'react';

import { TabNav } from '@mpieva/psydb-ui-layout';

// FIXME: put elsewhere
const unique = (ary) => (
    ary.filter((it, index, self) => self.indexOf(it) === index)
);

// FIXME: put elsewhere
const gatherLocationTypesFromSettings = ({ settingRecords }) => {

    var locationTypes = (
        settingRecords
        .filter(it => (
            ['inhouse', 'online-video-call'].includes(it.type)
        ))
        .reduce((acc, setting) => {
            var currentTypes = setting.state.locations.map(it => (
                it.customRecordTypeKey
            ));

            return [ ...acc, ...currentTypes ];
        }, [])
    );

    return unique(locationTypes);
}

export const LocationTypeNav = ({
    settingRecords,
    settingRelated,

    studyRecord,
    customRecordTypeData,
    activeType,
    onSelect,
}) => {

    var items = useMemo(() => {
        var locationTypes = gatherLocationTypesFromSettings({
            settingRecords
        });
        var tabs = locationTypes.map(type => ({
            key: type,
            label: (
                settingRelated.relatedCustomRecordTypes.location[type]
                .state.label
            )
        }));

        return tabs;
    }, [ studyRecord ])

    return (
        <TabNav
            items={ items }
            activeKey={ activeType }
            onItemClick={ onSelect }
        />
    )
}
