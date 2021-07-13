import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import Pair from '@mpieva/psydb-ui-lib/src/pair';
import Split from '@mpieva/psydb-ui-lib/src/split';
import PaddedText from '@mpieva/psydb-ui-lib/src/padded-text';
import TeamNameAndColor from '@mpieva/psydb-ui-lib/src/team-name-and-color';

import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';
import applyValueToDisplayFields from '@mpieva/psydb-ui-lib/src/apply-value-to-display-fields';

const experimentTypeNames = {
    'inhouse': 'Inhouse',
    'away-team': 'Aussen-Team',
}

const General = ({
    experimentData,
    experimentOperatorTeamData,
    locationData,
    studyData
}) => {
    var experimentRecord = experimentData.record;
    var studyRecord = studyData.record;

    var stringifyExperimentValue = createStringifier(experimentData);
    var stringifyStudyValue = createStringifier(studyData);

    var experimentType = experimentRecord.type;

    return (
            <Container>
                <Split num={2}>
                    <Pair label='Typ'>
                        { experimentTypeNames[experimentRecord.type] }
                    </Pair>
                    <Pair label='Team'>
                        <TeamNameAndColor teamRecord={
                            experimentOperatorTeamData.record
                        } />
                    </Pair>
                </Split>
                
                <Split num={2}>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(experimentRecord.state.interval.start),
                            'P'
                        ) }
                    </Pair>
                    { experimentType === 'inhouse' && (
                        <Pair label='Uhrzeit'>
                            { datefns.format(
                                new Date(experimentRecord.state.interval.start),
                                'p'
                            ) }
                            {' bis '}
                            { datefns.format(
                                new Date(experimentRecord.state.interval.end).getTime() + 1,
                                'p'
                            ) }
                        </Pair>
                    )}
                </Split>

                <Split>
                    <Pair label='Studie'>
                        { studyRecord.state.shorthand }
                    </Pair>
                    <Pair label='Forschungsgruppe'>
                        { stringifyStudyValue({
                            ptr: '/state/researchGroupIds',
                            type: 'ForeignIdList',
                            collection: 'researchGroup'
                        })}
                    </Pair>
                </Split>
                
                <LocationInfo { ...({
                    experimentType,
                    locationData,
                }) } />
                
            </Container>
    );
}

const LocationInfo = ({
    experimentType,
    locationData,
}) => {
    if (experimentType === 'inhouse') {
        return (
            <Split>
                <Pair label='Location'>
                    { locationData.record._recordLabel}
                </Pair>
                <Pair label='Location-Typ'>
                    { locationData.recordTypeLabel}
                </Pair>
            </Split>
        );
    }
    else {
    
        var withValue = applyValueToDisplayFields({
            ...locationData,
        });

        return (
            <div>
                <Split num={2}>
                    <Pair label='Location-Typ'>
                        { locationData.recordTypeLabel}
                    </Pair>
                </Split>
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
