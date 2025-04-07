import React from 'react';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, Alert } from '@mpieva/psydb-ui-layout';

const SubjectExperiments = (ps) => {
    var { past, future, related } = ps;
    var [{ translate }] = useI18N();

    return (
        <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
            <div>
                <h5>{ translate('Study Participations') }</h5>
                <ExperimentList records={ past } related={ related } />
            </div>
            <div>
                <h5>{ translate('Appointments') }</h5>
                <ExperimentList records={ future } related={ related } />
            </div>
        </Grid>
    )
}

const ExperimentList = (ps) => {
    var { records, related } = ps;
    var [ i18n ] = useI18N();
    var { translate } = i18n;

    if (records.length < 1) {
        return <Alert variant='info'><i>{ translate('None') }</i></Alert>
    }

    var definitions = {
        start: { pointer: '/state/interval/start'},
        studyId: { pointer: '/state/studyId', props: {
            collection: 'study'
        }},
    }

    return (
        <Grid cols={[ '1fr' ]} gap='0.5rem'>{ records.map((record, ix) => (
            <Grid 
                key={ ix } cols={[ '1fr', '1fr' ]}
                className='bg-white border p-3'
            >
                <span>Datum/Zeit</span>
                <b>{ Fields.DateTime.stringifyValue({
                    definition: definitions.start, record, i18n
                })}</b>
                <span>Studie</span>
                <b>{ Fields.ForeignId.stringifyValue({
                    definition: definitions.studyId, record, i18n, related
                })}</b>
            </Grid>
        )) }</Grid>
    );
}

export default SubjectExperiments;
