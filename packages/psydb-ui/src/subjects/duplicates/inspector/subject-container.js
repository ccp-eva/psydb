import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { __fixRelated } from '@mpieva/psydb-common-compat';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useRevision, useFetch, useSend } from '@mpieva/psydb-ui-hooks';
import { Grid, AsyncButton, Button, Alert } from '@mpieva/psydb-ui-layout';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

import ItemSelect from './item-select';
import SubjectEditor from './subject-editor';
import SubjectExperiments from './subject-experiments';

const SubjectContainer = (ps) => {
    var {
        subjectRecords,
        subjectRelated,
        subjectCRTSettings,

        recordType,
        dupGroup,
        state,
        mergeTargetId,
        direction,
        revision,
        onSuccessfulMerge,
    } = ps;

    var subjectsById = keyBy({ items: subjectRecords, byProp: '_id' });

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

    var now = new Date();
    var past = [];
    var future = [];
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
                    record={ subjectsById[id] }
                    related={ subjectRelated }
                    crtSettings={ subjectCRTSettings }

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

export default SubjectContainer
