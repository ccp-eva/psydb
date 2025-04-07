import React from 'react';
import { omit } from '@mpieva/psydb-core-utils';
import { useUITranslation, useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import {
    Table,
    Alert,
    LoadingIndicator,
    StudyIconButton,
} from '@mpieva/psydb-ui-layout';

import { Fields } from '@mpieva/psydb-custom-fields-common';

const StudyStatisticsResults = (ps) => {
    var { formData } = ps;

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.getAxios().post('/api/statistics/study', {
            ...sanitizeFormData(formData),
        })
    ), [ JSON.stringify(formData) ]);

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
            <th>{ translate('Start') }</th>
            <th>{ translate('End') }</th>
            <th>{ translate('_studyParticipations_short') }</th>
            <th>{ translate('Lab Workflows') }</th>
            <th>{ translate('Age Ranges') }</th>
            <th></th>
        </tr></thead>
    )
}

const ResultTable = (ps) => {
    var { aggregateItems } = ps;
    var translate = useUITranslation(); 

    var studyCount = aggregateItems.length;
    var totals = {};
    for (var it of aggregateItems) {
        for (var [ k, v ] of Object.entries(it.participationCounts)) {
            if (!totals[k]) {
                totals[k] = 0;
            }
            totals[k] += v;
        }
    }

    var { total: participationTotal, ...workflowTotals } = totals;

    return (
        <>
            <div className={`
                bg-light pt-2 pb-2 pr-3 pl-3
                d-flex align-items-center
            `}>
                <span style={{ width: '200px' }}>
                    <b>{ translate('Studies') }:</b>
                    {' '}
                    { studyCount }
                </span>
                <span>
                    <b className='d-inline-block mr-3'>
                        { translate('Study Participations') }:
                    </b>
                    <b>{ participationTotal } ({ translate('Total') })</b>
                    {' - '}
                    <LabMethods
                        types={ Object.keys(workflowTotals) }
                        counts={ workflowTotals }
                    />
                </span>
            </div>

            <Table>
                <TableHead { ...ps } />
                <tbody>
                    { aggregateItems.map((it) => (
                        <Row key={ it._id } item={ it } />
                    ))}
                </tbody>
            </Table>
        </>
    );
}

var Row = (ps) => {
    var { item } = ps;
    var {
        _id, type, shorthand, runningPeriod,
        labMethods, ageFrames, participationCounts
    } = item;

    var [ i18n ] = useI18N();
    var uri = `/studies/${type}/${_id}`;

    return (
        <tr>
            <td>{ shorthand }</td>
            
            <td>{ Fields.DateOnlyServerSide.stringifyValue({
                value: runningPeriod.start, i18n
            }) }</td>
            <td>{ Fields.DateOnlyServerSide.stringifyValue({
                value: runningPeriod.end, i18n
            }) }</td>

            <td>{ participationCounts.total }</td>
            <td>
                <LabMethods
                    types={ labMethods }
                    counts={ participationCounts }
                />
            </td>
            <td>{ ageFrames.map(a => (
                Fields.AgeFrameInterval.stringifyValue({ value: a, i18n })
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

const LabMethods = (ps) => {
    var { types, counts } = ps;
    var translate = useUITranslation(); 
    
    types = types.map(it => ({
        key: it,
        label: translate(`_labWorkflow_${it}`)
    })).sort((a,b) => (a.label < b.label ? -1 : 1));

    return types.map((it, ix) => {
        var c = counts[it.key] || 0;

        if (c === 0) {
            return null; // TODO: add toggle for this
        }

        return <span key={ it.key } style={ c === 0 ? { color: '#bbb' } : {}}>
            { it.label} ({ c })
            { ix < (types.length - 1) && ', ' }
        </span>
    });
}

const sanitizeFormData = (raw = {}) => {
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
        var { start = {}, end = {}} = raw.ageFrameIntervalOverlap;

        out.ageFrameIntervalOverlap = {
            start: {
                years: start.years || 0,
                months: start.months || 0,
                days: start.days || 0,
            },
            end: {
                years: end.years || 999999,
                months: end.months || 0,
                days: end.days || 0,
            },
        }
    }

    return out;
}

export default StudyStatisticsResults;
