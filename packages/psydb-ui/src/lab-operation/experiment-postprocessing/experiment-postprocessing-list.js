import React from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import {
    format as formatDateInterval
} from '@mpieva/psydb-date-interval-fns';

import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import {
    useFetch,
    useRevision,
    usePermissions
} from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    DetailsIconButton,
    ExperimentIconButton,
    Alert,
    Table,
} from '@mpieva/psydb-ui-layout';

import {
    datefns,
    PostprocessSubjectForm
} from '@mpieva/psydb-ui-lib';

import InhouseList from './inhouse-list';

const ExperimentPostprocessingListLoader = (ps) => {
    var { path, url } = useRouteMatch();

    var {
        studyType,
        experimentType,
        subjectType,
        researchGroupId,
    } = useParams();

    var revision = useRevision();

    var [ didFetch, fetched ] = useFetch((agent) => {
        return agent.fetchExperimentPostprocessing({
            experimentType,
            subjectRecordType: subjectType,
            researchGroupId,
        })
    }, [ researchGroupId, subjectType, revision.value ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var {
        records,
        relatedCustomRecordTypeLabels,
        relatedHelperSetItems,
        relatedRecordLabels,
    } = fetched.data;

    if (experimentType === 'inhouse') {
        return (
            <InhouseList {...({
                subjectType,

                records,
                relatedCustomRecordTypeLabels,
                relatedHelperSetItems,
                relatedRecordLabels,

                onSuccessfulUpdate: revision.up
            }) } />
        );
    }
    else if (experimentType === 'online-video-call') {
        return (
            <InhouseList {...({
                subjectType,

                records,
                relatedCustomRecordTypeLabels,
                relatedHelperSetItems,
                relatedRecordLabels,

                onSuccessfulUpdate: revision.up
            }) } />
        );
    }
    else if (experimentType === 'away-team') {
        return (
            <ExperimentPostprocessingList {...({
                records,
                relatedCustomRecordTypeLabels,
                relatedHelperSetItems,
                relatedRecordLabels,

                onSuccessfulUpdate: revision.up
            }) } />
        );
    }
}


const ExperimentPostprocessingList = (ps) => {
    // FIXME
    var ps = __fixRelated(ps);
    var { records, related, onSuccessfulUpdate } = ps;

    var [ i18n ] = useI18N();
    var { translate, locale } = i18n;

    if (records.length < 1) {
        return <Fallback />
    }

    return (
        <Table>
            <TableHead />
            <tbody>{ records.map(it => {
                var { _id, type, state } = it;
                var { studyId, locationId, interval } = state;
                var { startDate } = formatDateInterval(interval, { locale });

                return <tr key={ it._id }>
                    <td>{ translate(getExperimentTypeLabel(type)) }</td>
                    <td>{
                        Fields.ForeignId.stringifyValue({
                            value: studyId, related, i18n,
                            definition: { props: { collection: 'study' }}
                        })
                    }</td>
                    <td>{
                        Fields.ForeignId.stringifyValue({
                            value: locationId, related, i18n,
                            definition: { props: { collection: 'location' }}
                        })
                    }</td>
                    <td>{ startDate }</td>
                    <td className='d-flex justify-content-end'>
                        <ExperimentIconButton to={`/experiments/${type}/${_id}`} />
                    </td>
                </tr>
            }) }</tbody>
        </Table>
    )
}

const TableHead = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <thead>
            <tr>
                <th>{ translate('Type') }</th>
                <th>{ translate('Study') }</th>
                <th>{ translate('Location') }</th>
                <th>{ translate('Date') }</th>
                <th></th>
            </tr>
        </thead>
    )
}

const Fallback = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <>
            <Table className='mb-1'>
                <TableHead />
            </Table>
            <Alert variant='info'>
                <i>{ translate('No unprocessed appointments found.') }</i>
            </Alert>
        </>
    )
}

const getExperimentTypeLabel = (type) => (
    {
        'away-team': 'External Appointment',
        'inhouse': 'Inhouse Appointment',
        'online-video-call': 'Online Video Appointment',
    }[type] || 'UNKNOWN'
)

export default ExperimentPostprocessingListLoader;
