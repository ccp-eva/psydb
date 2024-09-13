import React from 'react';
import { Base64 } from 'js-base64';
import { useParams, useRouteMatch } from 'react-router-dom';

import { omit } from '@mpieva/psydb-core-utils';
import { fieldStringifiers } from '@mpieva/psydb-common-lib';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    Table,
    Alert,
    LoadingIndicator,
    StudyIconButton,
} from '@mpieva/psydb-ui-layout';

const maybeDecodeBase64 = (encoded, { isJson = true } = {}) => {
    var decoded = undefined;
    try {
        if (encoded) {
            decoded = Base64.decode(encoded);
            if (isJson) {
                decoded = JSON.parse(decoded);
            }
            console.log('decoded base64', decoded);
        }
    }
    catch (e) {
        console.log(e);
    }
    return decoded;
}

const StudyStatisticsResults = () => {
    var { b64 } = useParams();
    var decodedFormData = maybeDecodeBase64(b64, { isJson: true });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/statistics/study', {
            ...sanitizeFormData(decodedFormData),
        })
    ), [ b64 ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { aggregateItems } = fetched.data;

    var TableComponent = (
        aggregateItems.length > 0
        ? ResultTable
        : Fallback
    );

    return (
        <TableComponent aggregateItems={ aggregateItems } />
    )
}

const Fallback = (ps) => {
    var translate = useUITranslation();
    return (
        <>
            <Table>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>{ translate('No Records found.') }</i>
            </Alert>
        </>
    )
}

const TableHead = (ps) => {
    var translate = useUITranslation();
    return (
        <thead><tr>
            <th>{ translate('Shorthand') }</th>
            <th>{ translate('Lab Workflows') }</th>
            <th>{ translate('Age Ranges') }</th>
            <th></th>
        </tr></thead>
    )
}

const ResultTable = (ps) => {
    var { aggregateItems } = ps;
    return (
        <Table>
            <TableHead { ...ps } />
            <tbody>
                { aggregateItems.map((it) => (
                    <Row item={ it } />
                ))}
            </tbody>
        </Table>
    );
}

var Row = (ps) => {
    var { item } = ps;
    var { _id, type, shorthand, labMethods, ageFrames } = item;

    var translate = useUITranslation(); 
    var uri = `/studies/${type}/${_id}`;

    return (
        <tr key={ _id }>
            <td>{ shorthand }</td>
            <td>{ labMethods.map(l => (
                translate(`_labWorkflow_${l}`)
            )).sort().join(', ') }</td>
            <td>{ ageFrames.map(a => (
                // FIXME: fieldStringifiers.AgeFrame
                // cannot handle start/end being object
                fieldStringifiers.AgeFrameBoundary(a.start)
                + ' - ' +
                fieldStringifiers.AgeFrameBoundary(a.end)
            )).sort().join(' || ') }</td>

            <td className='d-flex justify-content-end'>
                <StudyIconButton
                    to={ uri }
                    buttonStyle={{
                        marginTop: '-5px',
                        marginBottom: '-5px'
                    }}
                    iconStyle={{
                        width: '22px',
                        height: '22px',
                        marginTop: '0px',
                    }}
                />
            </td>
        </tr>
    )
}

const sanitizeFormData = (raw = {}) => {
    console.log(raw);
    var out = omit({ from: raw, paths: [
        'labMethodKeys', 'ageFrameIntervalOverlap'
    ]});

    if (raw.labMethodKeys) {
        var { logicGate, values = [] } = raw.labMethodKeys;
        out.labMethodKeys = {
            logicGate,
            values: values.filter(it => !!it)
        }
    }

    if (raw.ageFrameIntervalOverlap) {
        var { start, end } = raw.ageFrameIntervalOverlap;

        out.ageFrameIntervalOverlap = {
            start: {
                years: start.years || 0,
                months: start.months || 0,
                days: start.days || 0,
            },
            end: {
                years: start.years || 999999,
                months: start.months || 0,
                days: start.days || 0,
            },
        }
    }

    // TODO: age frame overlap
    return out;
}

export default StudyStatisticsResults;
