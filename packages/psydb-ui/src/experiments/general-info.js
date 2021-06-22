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

import createStringifier from '@mpieva/psydb-ui-lib/src/record-field-stringifier';

const experimentTypeNames = {
    'inhouse': 'Inhouse',
    'away-team': 'Aussen-Team',
}

const General = ({
    experimentData,
    studyData
}) => {
    var experimentRecord = experimentData.record;
    var studyRecord = studyData.record;

    var stringifyExperimentValue = createStringifier(experimentData);
    var stringifyStudyValue = createStringifier(studyData);

    return (
            <Container>
                <Split num={2}>
                    <Pair label='Typ'>
                        { experimentTypeNames[experimentRecord.type] }
                    </Pair>
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

                <Split>
                    <Pair label='Location'>
                        { stringifyExperimentValue({
                            ptr: '/state/locationId',
                            type: 'ForeignId',
                            collection: 'location'
                        })}
                    </Pair>
                    <Pair label='Location-Typ'>
                        { stringifyExperimentValue({
                            ptr: '/state/locationRecordType',
                            collection: 'location',
                            type: 'CustomRecordTypeKey',
                        })}
                    </Pair>
                </Split>

                <Split num={2}>
                    <Pair label='Team'>
                        { stringifyExperimentValue({
                            ptr: '/state/experimentOperatorTeamId',
                            type: 'ForeignId',
                            collection: 'experimentOperatorTeam'
                        })}
                    </Pair>
                </Split>

                <Split>
                    <Pair label='Datum'>
                        { datefns.format(
                            new Date(experimentRecord.state.interval.start),
                            'P'
                        ) }
                    </Pair>
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
                </Split>

            </Container>
    );
}

export default General;
