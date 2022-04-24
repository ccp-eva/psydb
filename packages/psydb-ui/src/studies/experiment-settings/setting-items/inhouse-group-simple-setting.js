import React from 'react';

import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';

import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const InhouseGroupSimpleSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        customRecordTypes,
    } = ps;

    var {
        locations,
    } = settingRecord.state;

    var { relatedRecords } = settingRelated;

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label='Räumlichkeiten'>
                { locations.map(it => {
                    return (
                        relatedRecords
                        .location[it.locationId]._recordLabel
                    );
                }).join(', ')}
                { locations.length < 1 && (
                    <span>Keine</span>
                )}
            </Pair>
        </DefaultSettingWrapper>
    )
}
