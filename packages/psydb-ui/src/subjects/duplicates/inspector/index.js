import React from 'react';
import { keyBy } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, Alert } from '@mpieva/psydb-ui-layout';

import withInspectorComposition from './with-inspector-composition';

import DupGroupSummary from './dup-group-summary';
import SelectBar from './select-bar';
import ActionBar from './action-bar';
import SubjectContainer from './subject-container';

const Inspector = (ps) => {
    var {
        inspectedFields,
        subjectRecords, subjectRelated, subjectCRTSettings,
        selection,
        leftExperiments, rightExperiments,
        onSuccessfulMerge, onSuccessfulMark, onSuccessfulUnmark,
        onSuccessfulEdit,
    } = ps;

    var [{ translate }] = useI18N();
    
    var { leftId, rightId } = selection.state;
    var subjectsById = keyBy({ items: subjectRecords, byProp: '_id' });

    var actionBag = {
        subjectRecords, leftId, rightId,
        onSuccessfulMerge, onSuccessfulMark, onSuccessfulUnmark
    }
    var containerBag = {
        subjectRelated, subjectCRTSettings,
        onSuccessfulEdit,
    }
    return (
        <>
            <div className='bg-light p-3 border mb-3'>
                <DupGroupSummary
                    inspectedFields={ inspectedFields }
                    subjects={ subjectRecords }
                />
            </div>
            
            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div>{ leftId ? (
                    <SelectBar
                        subjectRecords={ subjectRecords }
                        experiments={ leftExperiments }
                        state={ selection.left }
                        mergeTargetId={ rightId }
                    />
                ) : (
                    <Alert variant='info'><i>
                        { translate('No possible duplicates left!') }
                    </i></Alert>
                )}</div>
                
                <div>{ rightId ? (
                    <SelectBar
                        subjectRecords={ subjectRecords }
                        experiments={ rightExperiments }
                        state={ selection.right }
                        mergeTargetId={ leftId }
                    />
                ) : (
                    <Alert variant='info'><i>
                        { translate('No possible duplicates left!') }
                    </i></Alert>
                )}</div>
            </Grid>

            { (leftId && rightId) && (
                <ActionBar { ...actionBag } />
            )}

            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div>{ leftId && (
                    <SubjectContainer
                        subjectRecord={ subjectsById[leftId] }
                        experiments={ leftExperiments }
                        { ...containerBag }
                    />
                )}</div>
                <div>{ rightId && (
                    <SubjectContainer
                        subjectRecord={ subjectsById[rightId] }
                        experiments={ rightExperiments }
                        { ...containerBag }
                    />
                )}</div>
            </Grid>
        </>
    )
}


const ComposedInspector = withInspectorComposition(Inspector);
export default ComposedInspector;
