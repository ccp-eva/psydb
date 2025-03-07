import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Grid, Alert } from '@mpieva/psydb-ui-layout';

import withInspectorComposition from './with-inspector-composition';

import ActionBar from './action-bar';
import DupGroupSummary from './dup-group-summary';
import ItemSelect from './item-select';
import SubjectContainer from './subject-container';


const Inspector = (ps) => {
    var {
        revision, inspectedFields,
        subjectRecords, subjectRelated, subjectCRTSettings,
        selection,
        leftExperiments, rightExperiments,
        onSuccessfulMerge,
    } = ps;

    var { leftId, rightId } = selection.state;

    var [{ translate }] = useI18N();
    
    var containerBag = {
        subjectRecords, subjectRelated, subjectCRTSettings,
        revision, onSuccessfulMerge,
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
                
                <div>{ leftId ? (
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
                <ActionBar
                    subjectRecords={ subjectRecords }
                    leftId={ leftId }
                    rightId={ rightId }

                    onSuccessfulMerge={ onSuccessfulMerge }
                />
            )}

            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div>{ leftId && (
                    <SubjectContainer
                        state={ selection.left }
                        mergeTargetId={ rightId }
                        direction='right'
                        { ...containerBag }
                    />
                )}</div>
                <div>{ rightId && (
                    <SubjectContainer
                        state={ selection.right }
                        mergeTargetId={ leftId }
                        direction='left'
                        { ...containerBag }
                    />
                )}</div>
            </Grid>
        </>
    )
}

const SelectBar = (ps) => {
    var { subjectRecords, experiments, state, mergeTargetId } = ps;
    var { past, future } = experiments;
    var [ id, setId ] = state;

    return (
        <Grid className='bg-light border p-3 mb-3' cols={[ '1fr', '1fr' ]}>
            <ItemSelect
                items={ subjectRecords } value={ id } onChange={ setId }
                disabledId={ mergeTargetId }
            />
            <SubjectExperimentSummary past={ past } future={ future } />
        </Grid>
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

const ComposedInspector = withInspectorComposition(Inspector);
export default ComposedInspector;
