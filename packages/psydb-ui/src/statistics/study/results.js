import React from 'react';
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
            {/*<th>{ translate('_studyParticipations_short') }</th>*/}
            <th>N</th>
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
    var participationTotal = aggregateItems.reduce((acc, it) => (
        acc + it.participationCounts.total
    ), 0);

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
                <span style={{ width: '200px' }}>
                    <b>{ translate('Study Participations') }:</b>
                    {' '}
                    { participationTotal }
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
        _id, type, shorthand,
        labMethods, ageFrames, participationCounts
    } = item;

    var translate = useUITranslation(); 
    var uri = `/studies/${type}/${_id}`;

    return (
        <tr>
            <td>{ shorthand }</td>
            <td>{ participationCounts.total }</td>
            <td>
                <LabMethods
                    types={ labMethods }
                    counts={ participationCounts }
                />
            </td>
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

const LabMethods = (ps) => {
    var { types, counts } = ps;
    var translate = useUITranslation(); 
    
    types = types.map(it => ({
        key: it,
        label: translate(`_labWorkflow_${it}`)
    })).sort((a,b) => (a.label < b.label ? -1 : 1));

    return types.map((it, ix) => {
        var c = counts[it.key] || 0;
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
