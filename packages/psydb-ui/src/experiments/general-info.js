import React from 'react';

import enums from '@mpieva/psydb-schema-enums';

import {
    useUITranslation,
    useUILocale,
    useUILanguage,
} from '@mpieva/psydb-ui-contexts';

import {
    usePermissions,
    useModalReducer,
    useRevision,
} from '@mpieva/psydb-ui-hooks';

import {
    Container,
    Row,
    Col,
    Pair,
    Split,
    PaddedText,
    EditIconButtonInline,
} from '@mpieva/psydb-ui-layout';

import {
    EditExperimentCommentModal
} from '@mpieva/psydb-ui-lib/src/modals';

import {
    formatDateInterval,
    datefns,
} from '@mpieva/psydb-ui-lib';

import TeamNameAndColor from '@mpieva/psydb-ui-lib/src/team-name-and-color';

import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

const General = (ps) => {
    var {
        experimentData,
        opsTeamData,
        locationData,
        studyData,
        onSuccessfulUpdate
    } = ps;
    var permissions = usePermissions();

    var experimentRecord = experimentData.record;
    var studyRecord = studyData.record;

    var stringifyExperimentValue = createStringifier(experimentData);
    var stringifyStudyValue = createStringifier(studyData);

    var experimentType = experimentRecord.type;
   
    var firstResearchGroupId = (
        permissions.isRoot()
        ? studyRecord.state.researchGroupIds[0]
        : (
            permissions.
            getResearchGroupIds(studyRecord.state.researchGroupIds)
            .shift()
        )
    );

    var isInviteExperiment = (
        enums.inviteLabMethods.keys.includes(experimentType)
    );

    var {
        startDate, startTime,
        endDate, endTime
    } = formatDateInterval(experimentRecord.state.interval);

    var researchGroupLabel = stringifyStudyValue({
        ptr: '/state/researchGroupIds',
        type: 'ForeignIdList',
        collection: 'researchGroup'
    });

    var t = experimentRecord.realType || experimentRecord.type;

    var sharedBag = {
        experimentId: experimentRecord._id,
        experimentTypeLabel: enums.labMethods.mapping[t],
        studyLabel: studyRecord.state.shorthand,
        firstResearchGroupId,
        researchGroupLabel,
        interval: experimentRecord.state.interval,
        locationData,
        opsTeamData,

        onSuccessfulUpdate
    }

    var content = null;
    if (t === 'online-survey') {
        content = (
            <OnlineSurveyVariant { ...sharedBag } />
        );
    }
    else if (isInviteExperiment) {
        content = (
            <InviteVariant { ...sharedBag } />
        );
    }
    else {
        content = (
            <AwayTeamVariant
                { ...sharedBag }
                comment={ experimentRecord.state.comment }
            />
        );
    }

    return (
            <Container>
                { content }
            </Container>
    );
}

const OnlineSurveyVariant = (ps) => {
    var {
        experimentTypeLabel,
        studyLabel,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    var {
        startDate, startTime, endTime
    } = formatDateInterval(interval, { locale });

    return (
        <>
            <Split num={2}>
                <Pair label={ translate('Study') }>
                    { studyLabel }
                </Pair>
                <Pair label={ translate('Type') }>
                    { translate(experimentTypeLabel) }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label={ translate('Date') }>
                    { startDate }
                </Pair>
                <Pair label={ translate('Time') }>
                    { startTime }
                    {' '}
                    { translate('to') }
                    {' '}
                    { endTime }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label={ translate('Research Group') }>
                    { researchGroupLabel }
                </Pair>
            </Split>
        </>
    )
};
const InviteVariant = (ps) => {
    var {
        experimentTypeLabel,
        studyLabel,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,
    } = ps;

    var locale = useUILocale();
    var translate = useUITranslation();

    var {
        startDate, startTime, endTime
    } = formatDateInterval(interval, { locale });

    return (
        <>
            <Split num={2}>
                <Pair label={ translate('Study') }>
                    { studyLabel }
                </Pair>
                <Pair label={ translate('Team') }>
                    { 
                        opsTeamData
                        ? <TeamNameAndColor
                            teamRecord={ opsTeamData.record }
                        />
                        : translate('Unknown')
                    }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label={ translate('Date') }>
                    { startDate }
                </Pair>
                <Pair label={ translate('Time') }>
                    { startTime }
                    {' '}
                    { translate('to') }
                    {' '}
                    { endTime }
                </Pair>
            </Split>

            <Split>
                <Pair label={ translate('Research Group') }>
                    { researchGroupLabel }
                </Pair>
                <Pair label={ translate('Type') }>
                    { translate(experimentTypeLabel) }
                </Pair>
            </Split>
            
            <Split>
                <Pair label={ translate('Location') }>
                    { locationData.record._recordLabel}
                </Pair>
                <Pair label={ translate('Location Type') }>
                    { locationData.recordTypeLabel}
                </Pair>
            </Split>
        </>
    )
};


const AwayTeamVariant = (ps) => {
    var {
        experimentId,
        experimentTypeLabel,
        studyLabel,
        firstResearchGroupId,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,
        comment,
        onSuccessfulUpdate
    } = ps;

    var [ language ] = useUILanguage();
    var locale = useUILocale();
    var translate = useUITranslation();

    var commentModal = useModalReducer();

    var locationType = locationData.record.type;
    var weekStart = datefns.startOfWeek(new Date(interval.start));
    var weekStartTimestamp = weekStart.getTime();
    
    var { startDate } = formatDateInterval(interval, { locale });

    var withValue = applyValueToDisplayFields({
        ...locationData,
        locale,
        language,
    });

    return (
        <>
            <EditExperimentCommentModal
                { ...commentModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Split num={2}>
                <div>
                    <Pair label={ translate('Study') }>
                        { studyLabel }
                    </Pair>
                    <Pair label={ translate('Team') }>
                        { 
                            opsTeamData
                            ? <TeamNameAndColor
                                teamRecord={ opsTeamData.record }
                            />
                            : translate('Unknown')
                        }
                    </Pair>
                    <Pair label={ translate('Date') }>
                        <a href={`#/calendars/away-team/${locationType}/${firstResearchGroupId}?d=${weekStartTimestamp}`}>
                            { startDate }
                        </a>
                    </Pair>
                    <Pair label={ translate('Research Group') }>
                        { researchGroupLabel }
                    </Pair>
                    <Pair label={ translate('Type') }>
                        { translate(experimentTypeLabel) }
                    </Pair>
                </div>
                <div>
                    <Pair label={ translate('Location Type') }>
                        { locationData.recordTypeLabel }
                    </Pair>
                    <div className='ml-3 pl-3' style={{
                        borderLeft: '3px solid #dfe0e1'
                    }}>
                        { withValue.map((it, index) => (
                            <Pair
                                key={ index } wLeft={ 3 }
                                label={
                                    (it.displayNameI18N || {})[language]
                                    || it.displayName
                                }
                            >
                                { it.value }
                            </Pair>
                        )) }
                    </div>
                </div>
            </Split>
            <header className='mt-3'>
                <b>{ translate('Comment') }</b>
                <EditIconButtonInline
                    onClick={ () => commentModal.handleShow({
                        experimentId,
                        experimentComment: comment
                    }) }
                />
            </header>
            <div className='px-3 py-2 bg-white border'>
                { comment ? (
                    comment
                ) : (
                    <i className='text-muted'>
                        { translate('No Comment') }
                    </i>
                )}
            </div>
        </>
    )
};

export default General;
