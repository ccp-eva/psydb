import React from 'react';

import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';

import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const InhouseSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        customRecordTypes,
    } = ps;

    var {
        subjectTypeKey,
        subjectsPerExperiment,
        subjectFieldRequirements,
        locations,
    } = settingRecord.state;

    var { relatedRecords } = settingRelated;

    var subjectType = customRecordTypes.find(it => (
        it.collection === 'subject' && it.type === subjectTypeKey
    ));

    var fieldLabels = (
        subjectType.state.settings.subChannelFields.scientific
        .reduce((acc, field) => {
            var { key, displayName } = field;
            var pointer = (
                `/scientific/state/custom/${key}`
            );
            return { ...acc, [pointer]: displayName };
        }, {})
    );

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label='Anzahl pro Termin'>
                { subjectsPerExperiment }
            </Pair>
            <Pair label='Terminbedingungen' textWrap='div'>
                { subjectFieldRequirements.map((req, index) => {
                    var { pointer, check } = req;
                    return (
                        <div className='d-flex' key={ index }>
                            <div className='mr-2'>
                                <b style={{ fontWeight: 600 }}>
                                    { index + 1 }.
                                </b>
                            </div>
                            <b style={{ fontWeight: 600 }}>
                                { fieldLabels[pointer] }
                                {' - '}
                                { checksEnum.mapping[check] }
                            </b>
                        </div>
                    )
                }) }
            </Pair>
            <Pair label='Räumlichkeiten'>
                { locations.map(it => {
                    return (
                        relatedRecords
                        .location[it.locationId]._recordLabel
                    );
                }).join(', ')}
            </Pair>
        </DefaultSettingWrapper>
    )
}
