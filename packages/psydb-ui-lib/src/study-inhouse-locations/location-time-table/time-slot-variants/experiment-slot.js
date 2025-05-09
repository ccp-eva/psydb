import React from 'react';
import classnames from 'classnames';
import { useUILocale } from '@mpieva/psydb-ui-contexts';
import { ColoredBox, Icons } from '@mpieva/psydb-ui-layout';

import datefns from '../../../date-fns';

import OtherStudySlot from './other-study-slot';

const ExperimentSlot = (ps) => {
    var {
        timestamp,
        isFirstSlotOfExperiment,
        experimentRecord,

        slotDuration,
        studyId,
        locationRecord,
        teamRecords,

        settingRecords,
        settingRelated,

        subjectRecordType,
        currentExperimentId,
        currentSubjectRecord,

        __useNewCanSelect,
        checkExperimentSlotSelectable,
        onSelectExperimentSlot,
    } = ps;

    var locale = useUILocale();

    var canSelect = (
        checkExperimentSlotSelectable
        ? checkExperimentSlotSelectable(ps)
        : true
    );

    var date = new Date(timestamp);

    var teamRecord = teamRecords.find(it => (
        it._id === experimentRecord.state.experimentOperatorTeamId
    ));

    // this reservation does not belong to any of the study teams
    if (!teamRecord) {
        return (
            <OtherStudySlot studyLabel={ experimentRecord._studyLabel } />
        );
        /*return (
            <div
                className='border text-center m-1'
                style={{
                    height: '26px',
                }}
            >-</div>
        )*/
    }

    var {
        _isAugmented,
        _matchesRequirements,
        _missingCount
    } = experimentRecord;

    var missingCount = (
        _isAugmented && _missingCount !== undefined
        ? _missingCount
        : countMissing({
            experimentRecord,
            settingRecords,
            subjectRecordType
        })
    )

    var isSameExperiment = (
        currentExperimentId && experimentRecord._id === currentExperimentId
    )

    var canClick = false;
    if (__useNewCanSelect) {
        canClick = canSelect && onSelectExperimentSlot;
    }
    else {
        canClick = (
            canSelect &&
            onSelectExperimentSlot &&
            missingCount > 0 &&
            !isSameExperiment && 
            (_isAugmented && _matchesRequirements)
        );
    }

    return (
        <ColoredBox
            bg={ teamRecord.state.color }
            role={ canClick ? 'button' : '' }
            className='text-center m-1'
            extraStyle={{
                height: '26px',
                background: teamRecord.state.color,
                ...(!canClick && {
                    opacity: 0.5
                }),
            }}
            onClick={ () => {
                canClick && onSelectExperimentSlot({
                    studyId,
                    locationRecord,
                    experimentRecord,
                    start: date,
                    slotDuration,
                    // maxEnd
                })
            }}
        >
            <div className='d-flex'>
                <ExperimentSlotPosIndicator { ...({
                    isFirstSlotOfExperiment,
                }) } />
                <b className='d-inline-block pl-1 pr-1 flex-grow' style={{
                    height: '26px',
                    //borderLeft: '4px solid',
                    //borderRight: '4px solid',
                    //borderColor: getTextColor(teamRecord.state.color),
                }}>
                    <span>{ datefns.format(date, 'p', { locale }) }</span>
                </b>
                <SubjectCountIndicator { ...({
                    experimentRecord,
                    subjectRecordType,
                
                    settingRecords,
                    settingRelated,
                    missingCount,
                })} />
            </div>
        </ColoredBox>
    );
}

var countMissing = (options)  => {
    var {
        experimentRecord,
        settingRecords,
        subjectRecordType,
    } = options;

    var { type: experimentType, state: { subjectData }} = experimentRecord;

    var relevantSettings = settingRecords.filter(it => (
        it.type === experimentType &&
        (!subjectRecordType || it.state.subjectTypeKey === subjectRecordType)
    ));

    var missingCountByType = (
        relevantSettings.reduce((acc, it) => ({
            ...acc,
            [it.state.subjectTypeKey]: it.state.subjectsPerExperiment
        }), {})
    );

    for (var it of subjectData) {
        if (missingCountByType[it.subjectType]) {
            missingCountByType[it.subjectType] -= 1;
        }
    }

    var missingCount = (
        subjectRecordType
        ? missingCountByType[subjectRecordType]
        : (
            Object.keys(missingCountByType).reduce((acc, key) => (
                acc === 0 ? 0 : missingCountByType[key]
            ), Infinity)
        )
    )

    return missingCount;
}

const ExperimentSlotPosIndicator = (ps) => {
    var { isFirstSlotOfExperiment } = ps;

    var Indication = (
        isFirstSlotOfExperiment
        ? <Icons.CaretRightFill style={{
            width: '12px', height: '12px', marginTop: '-3px'
        }} />
        : null
    )

    return (
        <span
            className={`text-center`}
            style={{
                height: '26px',
                width: '30px'
            }}
        >
            { Indication }
        </span>
    );
}

const SubjectCountIndicator = (ps) => {
    var {
        experimentRecord,
        subjectRecordType,

        settingRecords,
        settingRelated,
        missingCount,
    } = ps;

    var Indication = (
        subjectRecordType && missingCount !== 0
        ? <b>-{ missingCount }</b>
        : <Icons.PersonFill style={{ width: '20px', height: '20px', marginTop: '-3px' }} />
    )

    var textClass = missingCount === 0 ? 'text-success' : 'text-danger'

    return (
        <span
            className={`bg-white text-center ${textClass}`}
            style={{

                border: '1px solid #333',

                height: '26px',
                width: '30px'
            }}
        >
            { Indication }
        </span>
    );
}

export default ExperimentSlot;
