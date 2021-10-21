import React from 'react';
import { experimentVariants as evEnum } from '@mpieva/psydb-schema-enums';
import { Button, Pair, EditIconButton } from '@mpieva/psydb-ui-layout';

const VariantListItem = (ps) => {
    var {
        index,
        subjectTypeLabels,
        variantRecord,
        settingRecords,
        onAddSetting
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3'>
                <header className='border-bottom pb-1 mb-3'>
                    <b>Ablauf { index + 1 } - { evEnum.mapping[variantType] }</b>
                </header>

                <SettingList { ...({
                    variantType,
                    settingRecords,
                    subjectTypeLabels,
                })} />

                <hr />

                <Button
                    size='sm'
                    onClick={ () => onAddSetting({ variantRecord })}
                >
                    + Probandentyp
                </Button>
            </div>
        </div>
    )
}

const SettingList = (ps) => {
    var {
        variantType,
        settingRecords,
        subjectTypeLabels,
    } = ps;

    if (settingRecords.length < 1) {
        return (
            <div className='p-3 text-danger'>
                <i>Keine Probanden-Typen</i>
            </div>
        )
    }

    var SettingComponent = ({
        'inhouse': InhouseSetting,
        'away-team': AwayTeamSetting,
        'online-video-call': OnlineVideoCallSetting,
        'online-survey': OnlineSurveySetting
    })[variantType];

    return (
        <div>
            { settingRecords.map(record => (
                <SettingComponent
                    settingRecord={ record }
                    subjectTypeLabels={ subjectTypeLabels }
                />
            ))}
        </div>
    )
}

const InhouseSetting = (ps) => {
    var {
        settingRecord,
        subjectTypeLabels,
        subjectTypeFieldLabels,
    } = ps;

    var {
        subjectTypeKey,
        subjectsPerExperiment,
        subjectFieldRequirements,
        locations,
    } = settingRecord.state;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-start'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    { subjectTypeLabels[subjectTypeKey] }
                </header>

                <Pair label='Anzahl pro Termin'>
                    { subjectsPerExperiment }
                </Pair>
                <Pair label='Terminbedingungen'>
                    { subjectsPerExperiment }
                </Pair>
                <Pair label='Räumlichkeiten'>
                    { subjectsPerExperiment }
                </Pair>
            </div>
            <EditIconButton />
        </div>
    )
}

const AwayTeamSetting = (ps) => {
    var {
        settingRecord,
        subjectTypeLabels
    } = ps;

    var { subjectTypeKey } = settingRecord.state;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    { subjectTypeLabels[subjectTypeKey] }
                </header>
            </div>
            <EditIconButton />
        </div>
    )
}

const OnlineVideoCallSetting = (ps) => {
    return (
        <div>video</div>
    )
}

const OnlineSurveySetting = (ps) => {
    var {
        settingRecord,
        subjectTypeLabels
    } = ps;

    var { subjectTypeKey } = settingRecord.state;

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-center'>
            <div>{ subjectTypeLabels[subjectTypeKey] }</div>
            <EditIconButton />
        </div>
    )
}

export default VariantListItem;
