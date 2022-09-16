import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    usePermissions,
    useModalReducer,
    useRevision,
} from '@mpieva/psydb-ui-hooks';

import {
    experimentTypes,
    inviteExperimentTypes
} from '@mpieva/psydb-schema-enums';

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

const General = ({
    experimentData,
    opsTeamData,
    locationData,
    studyData,
    onSuccessfulUpdate
}) => {
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
        inviteExperimentTypes.keys.includes(experimentType)
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

    var sharedBag = {
        experimentId: experimentRecord._id,
        experimentTypeLabel: experimentTypes.mapping[experimentRecord.type],
        studyLabel: studyRecord.state.shorthand,
        firstResearchGroupId,
        researchGroupLabel,
        interval: experimentRecord.state.interval,
        locationData,
        opsTeamData,

        onSuccessfulUpdate
    }

    return (
            <Container>
                {
                    isInviteExperiment
                    ? (
                        <InviteVariant
                            { ...sharedBag }
                        />
                    )
                    : (
                        <AwayTeamVariant
                            { ...sharedBag }
                            comment={ experimentRecord.state.comment }
                        />
                    )
                }
            </Container>
    );
}

const InviteVariant = (ps) => {
    var {
        experimentTypeLabel,
        studyLabel,
        researchGroupLabel,
        interval,
        locationData,
        opsTeamData,
    } = ps;

    var {
        startDate, startTime, endTime
    } = formatDateInterval(interval);

    return (
        <>
            <Split num={2}>
                <Pair label='Studie'>
                    { studyLabel }
                </Pair>
                <Pair label='Team'>
                    { 
                        opsTeamData
                        ? <TeamNameAndColor
                            teamRecord={ opsTeamData.record }
                        />
                        : 'Unbekannt'
                    }
                </Pair>
            </Split>

            <Split num={2}>
                <Pair label='Datum'>
                    { startDate }
                </Pair>
                <Pair label='Uhrzeit'>
                    { startTime }
                    {' bis '}
                    { endTime }
                </Pair>
            </Split>

            <Split>
                <Pair label='Forschungsgruppe'>
                    { researchGroupLabel }
                </Pair>
                <Pair label='Typ'>
                    { experimentTypeLabel }
                </Pair>
            </Split>
            
            <Split>
                <Pair label='Location'>
                    { locationData.record._recordLabel}
                </Pair>
                <Pair label='Location-Typ'>
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

    var commentModal = useModalReducer();

    var locationType = locationData.record.type;
    var weekStart = datefns.startOfWeek(new Date(interval.start));
    var weekStartTimestamp = weekStart.getTime();
    
    var { startDate } = formatDateInterval(interval);

    var withValue = applyValueToDisplayFields({
        ...locationData,
    });

    return (
        <>
            <EditExperimentCommentModal
                { ...commentModal.passthrough }
                onSuccessfulUpdate={ onSuccessfulUpdate }
            />
            <Split num={2}>
                <div>
                    <Pair label='Studie'>
                        { studyLabel }
                    </Pair>
                    <Pair label='Team'>
                        { 
                            opsTeamData
                            ? <TeamNameAndColor
                                teamRecord={ opsTeamData.record }
                            />
                            : 'Unbekannt'
                        }
                    </Pair>
                    <Pair label='Datum'>
                        <a href={`#/calendars/away-team/${locationType}/${firstResearchGroupId}?d=${weekStartTimestamp}`}>
                            { startDate }
                        </a>
                    </Pair>
                    <Pair label='Forschungsgruppe'>
                        { researchGroupLabel }
                    </Pair>
                    <Pair label='Typ'>
                        { experimentTypeLabel }
                    </Pair>
                </div>
                <div>
                    <Pair label='Location-Typ'>
                        { locationData.recordTypeLabel }
                    </Pair>
                    <div className='ml-3 pl-3' style={{
                        borderLeft: '3px solid #dfe0e1'
                    }}>
                        { withValue.map((it, index) => (
                            <Pair
                                key={ index } wLeft={ 3 }
                                label={ it.displayName }
                            >
                                { it.value }
                            </Pair>
                        )) }
                    </div>
                </div>
            </Split>
            <header className='mt-3'>
                <b>Kommentar</b>
                <EditIconButtonInline
                    onClick={ () => commentModal.handleShow({
                        experimentId,
                        experimentComment: comment
                    }) }
                />
            </header>
            <div className='px-3 py-2 bg-white border'>
                { comment ? comment : <i className='text-muted'>Kein Kommentar</i> }
            </div>
        </>
    )
};

const LocationInfo = ({
    isInviteExperiment,
    experimentType,
    locationData,
}) => {
    if (isInviteExperiment) {
    }
    else {

        var withValue = applyValueToDisplayFields({
            ...locationData,
        });

        return (
            <div>
                <Pair label='Location-Typ'>
                    { locationData.recordTypeLabel }
                </Pair>
                <div className='ml-3 pl-3' style={{
                    borderLeft: '3px solid #dfe0e1'
                }}>
                    { withValue.map((it, index) => (
                        <Pair
                            key={ index } wLeft={ 2 }
                            label={ it.displayName }
                        >
                            { it.value }
                        </Pair>
                    )) }
                </div>
            </div>
        )
    }
}

export default General;
