import React from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

import datefns from '../../../date-fns';
import getTextColor from '../../../bw-text-color-for-background';

import OtherStudySlot from './other-study-slot';

const ExperimentSlot = (ps) => {
    var {
        timestamp,
        experimentRecord,

        slotDuration,
        studyRecord,
        locationRecord,
        teamRecords,

        settingRecords,
        settingRelated,

        subjectRecordType,
        currentExperimentId,
        currentSubjectRecord,

        onSelectExperimentSlot,
    } = ps;

    var { _id: studyId } = studyRecord;
    var date = new Date(timestamp);

    var teamRecord = teamRecords.find(it => (
        it._id === experimentRecord.state.experimentOperatorTeamId
    ));

    // this reservation does not belong to any of the study teams
    if (!teamRecord) {
        return <OtherStudySlot />
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

    var canClick = (
        onSelectExperimentSlot &&
        missingCount > 0 &&
        !isSameExperiment && 
        (_isAugmented && _matchesRequirements)
    );

    return (
        <div
            role={ canClick ? 'button' : undefined }
            className='text-center m-1'
            style={{
                height: '26px',
                background: teamRecord.state.color,
                color: getTextColor(teamRecord.state.color),
                ...(!canClick && {
                    opacity: 0.5
                }),
                //borderWidth: '2px',
                //borderStyle: 'dashed',
                //borderColor: getTextColor(teamRecord.state.color),
                //boxSizing: 'border-box'
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
                <b className='d-inline-block pl-1 pr-1 flex-grow' style={{
                    height: '26px',
                    //borderLeft: '4px solid',
                    //borderRight: '4px solid',
                    //borderColor: getTextColor(teamRecord.state.color),
                }}>
                    <span>{ datefns.format(date, 'p') }</span>
                </b>
                <SubjectCountIndicator { ...({
                    experimentRecord,
                    studyRecord,
                    subjectRecordType,
                
                    settingRecords,
                    settingRelated,
                    missingCount,
                })} />
            </div>
        </div>
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

const SubjectCountIndicator = (ps) => {
    var {
        experimentRecord,
        studyRecord,
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
