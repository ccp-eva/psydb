import React from 'react';

import enums from '@mpieva/psydb-schema-enums';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Pair } from '@mpieva/psydb-ui-layout';
import { DefaultSettingWrapper } from './utils';

export const InviteSetting = (ps) => {
    var {
        settingRecord,
        settingRelated,
        availableSubjectCRTs,
    } = ps;

    var {
        subjectTypeKey,
        subjectsPerExperiment,
        subjectFieldRequirements,
        locations,
    } = settingRecord.state;
    
    var { relatedRecords } = settingRelated;

    var subjectCRT = availableSubjectCRTs.find({
        type: subjectTypeKey
    });
    var fieldDefsByPointer = keyBy({
        items: subjectCRT.findCustomFields({
            'pointer': { $in: (
                subjectFieldRequirements.map(it => it.pointer)
            )}
        }),
        byProp: 'pointer'
    });

    var translate = useUITranslation();

    return (
        <DefaultSettingWrapper { ...ps }>
            <Pair label={ translate('per Appointment') }>
                { subjectsPerExperiment }
            </Pair>
            <Pair
                label={ translate('Appointment Conditions') }
                textWrap='div'
            >
                { subjectFieldRequirements.map((req, index) => {
                    var { pointer, check } = req;
                    var def = fieldDefsByPointer[pointer];
                    return (
                        <div className='d-flex' key={ index }>
                            <b style={{ fontWeight: 600 }} className='mr-2'>
                                { index + 1 }.
                            </b>
                            <b style={{ fontWeight: 600 }}>
                                { translate.fieldDefinition(def) }
                                {' - '}
                                { translate(enums.subjectFieldRequirementChecks.mapping[check]) }
                            </b>
                        </div>
                    )
                }) }
                { subjectFieldRequirements.length < 1 && (
                    <b style={{ fontWeight: 600 }}>
                        { translate('None') }
                    </b>
                )}
            </Pair>
            <Pair label={ translate('reservable_locations') }>
                { locations.map(it => {
                    return (
                        relatedRecords
                        .location[it.locationId]._recordLabel
                    );
                }).join(', ')}
                { locations.length < 1 && (
                    <span>
                        { translate('None') }
                    </span>
                )}
            </Pair>
        </DefaultSettingWrapper>
    )
}
