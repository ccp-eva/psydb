import React from 'react';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useRevision, useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { Grid, AsyncButton, Button, Alert } from '@mpieva/psydb-ui-layout';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

import ItemSelect from './item-select';

const SubjectContainer = (ps) => {
    var {
        recordType,
        dupGroup,
        state,
        mergeTargetId,
        direction,
        revision,
    } = ps;
    var [ id, setId ] = state;

    var [{ translate }] = useI18N();

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.fetchSubjectExperiments({ subjectId: id })
    ), [ id, revision.value ]);

    if (!didFetch) {
        return null;
    }

    var { records, related } = __fixRelated(fetched.data);

    var now = new Date(); var past = []; var future = [];
    for (var it of records) {
        var { interval } = it.state;
        ((new Date(interval.end) < now) ? past : future).push(it);
    }

    return (
        <>
            <div className='bg-light border p-3 mb-3'>
                <ItemSelect
                    items={ dupGroup.items }
                    value={ id } onChange={ setId }
                    disabledId={ mergeTargetId }
                />
                <SubjectExperimentSummary past={ past } future={ future } />
            </div>
            <div className='bg-light border p-3 mb-3'>
                <SubjectEditor id={ id } recordType={ recordType } />
            </div>
            <div className='bg-light border p-3'>
                <SubjectActions
                    id={ id }
                    mergeTargetId={ mergeTargetId }
                    hasExperiments={ past.length || future.length }
                    direction={ direction }
                    onSuccessfulUpdate={ revision.up }
                />
                <SubjectExperiments
                    past={ past } future={ future } related={ related }
                />
            </div>
        </>
    )
}


const SubjectExperimentSummary = (ps) => {
    var { past, future } = ps;

    return (
        <div className='d-flex gapx-3 mt-3'>
            <b>{ past.length } Teilnahmen</b>
            <b>{ future.length } Termine</b>
        </div>
    )
}

const SubjectEditor = (ps) => {
    var { id, recordType, onSuccessfulUpdate } = ps;
    var revision = useRevision();
    
    var providerBag = {
        id, recordType,
        revision, onSuccessfulUpdate
    };
    return (
        <RecordEditor.Provider { ...providerBag }>
            <RecordEditor.Context.Consumer>
                {(context) => (
                    <>
                        <RecordEditor.Body
                            { ...context }
                            renderFormBox={ false }
                            renderVisibilityButton={ false }
                        />
                        {/*<GenericRecordEditorFooter.RAW
                            { ...context }
                            enableHide={ false }
                            enableRemove={ true }
                            onSuccessfulUpdate={ revision.up }
                        />*/}
                    </>
                )}
            </RecordEditor.Context.Consumer>
        </RecordEditor.Provider>
    )
}

const SubjectActions = (ps) => {
    var {
        id, mergeTargetId, direction, hasExperiments,
        onSuccessfulUpdate
    } = ps;
    var [{ translate }] = useI18N();

    var send = useSend(() => ({
        type: 'subject/move-experiments-from-duplicate',
        payload: { sourceSubjectId: id, targetSubjectId: mergeTargetId }
    }), { onSuccessfulUpdate });

    var bag = { classname: 'px-3', size: 'sm' };
    var move = (
        <AsyncButton
            { ...bag } { ...send.passthrough }
            disabled={ !hasExperiments}
        >
            { direction === 'left' && '<- ' }
            { translate('Move Over') }
            { direction === 'right' && ' ->' }
        </AsyncButton>
    );
    var rem = (
        <Button
            { ...bag }
            variant='danger'
            disabled={ hasExperiments}
        >{ translate('Delete Subject') }</Button>
    );
    
    var className = 'd-flex justify-content-between border-bottom mb-3 pb-3';
    return direction === 'right' ? (
        <div className={ className }>{ rem }{ move }</div>
    ) : (
        <div className={ className }>{ move }{ rem }</div>
    )
}

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

export default SubjectContainer
