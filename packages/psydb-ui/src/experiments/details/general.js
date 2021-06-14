import React from 'react';
import jsonpointer from 'jsonpointer';

import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import datefns from '@mpieva/psydb-ui-lib/src/date-fns';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';

const createStringifier = ({
    record,
    relatedRecords: relatedRecordLabels,
    relatedHelperSetItems,
    relatedCustomRecordTypeLabels,
}) => (
    ({ ptr, type, collection, setId }) => {
        var rawValue = jsonpointer.get(record, ptr);
        var fieldDefinition = {
            type,
            props: { collection, setId }
        };
        return stringifyFieldValue({
            rawValue,
            fieldDefinition,
            relatedRecordLabels,
            relatedHelperSetItems,
            relatedCustomRecordTypeLabels,
        })
    }
)

const Pair = ({ label, children }) => {
    return (
        <Row>
            <Col sm={4}>
                <Text>{ label }</Text>
            </Col>
            <Col sm={8}>
                <Text><b style={{ fontWeight: 600 }}>{ children }</b></Text>
            </Col>
        </Row>
    );
}

const Split = ({ num, children }) => {
    if (!Array.isArray(children)) {
        children = [ children ];
    }
    var sm = 12 / (num || children.length);
    return (
        <Row>
            { children.map((it, index) => (
                <Col key={ index } sm={sm}>
                    { it }
                </Col>
            ))}
        </Row>
    );
}

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
                            type: 'CustomRecordType',
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

const Text = ({ children }) => {
    return (
        <div style={{
            paddingTop: 'calc(0.375rem + 1px)',
            paddingBottom: 'calc(0.375rem + 1px)',
        }}>{ children }</div>
    );
}

export default General;
