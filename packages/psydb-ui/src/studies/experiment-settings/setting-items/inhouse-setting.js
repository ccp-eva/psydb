import React from 'react';
import {
    subjectFieldRequirementChecks as checksEnum,
} from '@mpieva/psydb-schema-enums';
import {
    Pair,
    EditIconButton,
    RemoveIconButton,
} from '@mpieva/psydb-ui-layout';

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

    var {
        relatedCustomRecordTypes,
        relatedRecords,
    } = settingRelated;
    var { label } = relatedCustomRecordTypes.subject[subjectTypeKey].state;
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
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-start'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    <b>{ label }</b>
                </header>

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
            </div>
            <div className='d-flex flex-column'>
                <EditIconButton className='mb-2' />
                <RemoveIconButton />
            </div>
        </div>
    )
}
