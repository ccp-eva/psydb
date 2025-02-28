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
        onSuccessfulMerge,
    } = ps;

    var [ id, setId ] = state;
    var [{ translate }] = useI18N();
    //var revision = useRevision();

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
            <Grid
                className='bg-light border p-3 mb-3'
                cols={[ '1fr', '1fr' ]}
            >
                <ItemSelect
                    items={ dupGroup.items }
                    value={ id } onChange={ setId }
                    disabledId={ mergeTargetId }
                />
                <SubjectExperimentSummary past={ past } future={ future } />
            </Grid>
            <div className='bg-light border p-3 mb-3'>
                <SubjectEditor
                    id={ id }
                    recordType={ recordType }
                    revision={ revision }
                />
            </div>
            <div className='bg-light border p-3'>
                <SubjectActions
                    id={ id }
                    mergeTargetId={ mergeTargetId }
                    hasExperiments={ past.length || future.length }
                    direction={ direction }
                    onSuccessfulUpdate={ revision.up }
                    onSuccessfulMerge={ onSuccessfulMerge }
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
        <div className='d-flex gapx-3 align-items-center justify-content-end'>
            <b>{ past.length } Teilnahmen</b>
            <b>{ future.length } Termine</b>
        </div>
    )
}

const SubjectEditor = (ps) => {
    var { id, recordType, revision, onSuccessfulUpdate } = ps;
    
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
        onSuccessfulUpdate, onSuccessfulMerge
    } = ps;
    var [{ translate }] = useI18N();

    var sendMerge = useSend(() => ({
        type: 'subject/merge-duplicate',
        payload: { sourceSubjectId: id, targetSubjectId: mergeTargetId }
    }), { onSuccessfulUpdate: () => (
        onSuccessfulMerge({ mergedId: id })
    ) });
    
    var sendMark = useSend(() => ({
        type: 'subject/mark-non-duplicates',
        payload: { subjectIds: [ id, mergeTargetId ]}
    }), { onSuccessfulUpdate });

    var bag = { className: 'px-3', size: 'sm' };
    var move = (
        <AsyncButton
            { ...bag } { ...sendMerge.passthrough }
        >
            { direction === 'left' && '<- ' }
            { translate('Merge') }
            { direction === 'right' && ' ->' }
        </AsyncButton>
    );
    var nodup = (
        <AsyncButton { ...bag } { ...sendMark.passthrough }>
            { translate('Not a Duplicate') }
        </AsyncButton>
    );
    
    var className = 'd-flex justify-content-between border-bottom mb-3 pb-3';
    return direction === 'right' ? (
        <div className={ className }>{ nodup }{ move }</div>
    ) : (
        <div className={ className }>{ move }{ nodup }</div>
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
