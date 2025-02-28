import React, { useState, useReducer } from 'react';
import { without } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useRevision, useURLSearchParamsB64 } from '@mpieva/psydb-ui-hooks';
import { Grid, Alert } from '@mpieva/psydb-ui-layout';

import DupGroupSummary from './dup-group-summary';
import ItemSelect from './item-select';
import SubjectContainer from './subject-container';


const Inspector = (ps) => {
    var { recordType } = ps;

    var [{ translate }] = useI18N();
    var revision = useRevision();
    var [ query, updateQuery ] = useURLSearchParamsB64();
    console.log(query);

    var { items: queryItems } = query;
    var [ state, dispatch ] = useReducer(reducer, {
        items: queryItems,
        leftId: queryItems[0]?._id,
        rightId: queryItems[1]?._id 
    });
    
    var { items, leftId, rightId } = state;

    var leftState = [
        leftId, (id) => dispatch({ type: 'set-left', payload: id })
    ];
    var rightState = [
        rightId, (id) => dispatch({ type: 'set-right', payload: id })
    ];

    var onSuccessfulMerge = ({ mergedId }) => {
        var nextItems = [];
        for (var it of items) {
            if (it._id !== mergedId) {
                nextItems.push(it)
            }
        }
        
        updateQuery({ ...query, items: nextItems }, { action: 'replace' });
        dispatch({ type: 'set-items', payload: nextItems });
        revision.up();
        window.scrollTo(0, 0);
    };

    var dupGroup = { ...query, items };
    var containerBag = {
        dupGroup, recordType, revision,
        onSuccessfulMerge,
    }
    return (
        <>
            <div className='bg-light p-3 border mb-3'>
                <DupGroupSummary group={ dupGroup } />
            </div>
            <Grid cols={[ '1fr', '1fr' ]} gap='1rem'>
                <div className=''>
                    { leftId ? (
                        <SubjectContainer
                            state={ leftState }
                            mergeTargetId={ rightId }
                            direction='right'
                            { ...containerBag }
                        />
                    ) : (
                        <Alert variant='info'><i>
                            { translate('No possible duplicates left!') }
                        </i></Alert>
                    )}
                </div>
                <div className=''>
                    { rightId ? (
                        <SubjectContainer
                            state={ rightState }
                            mergeTargetId={ leftId }
                            direction='left'
                            { ...containerBag }
                        />
                    ) : (
                        <Alert variant='info'><i>
                            { translate('No possible duplicates left!') }
                        </i></Alert>
                    )}
                </div>
            </Grid>
        </>
    )
}

const reducer = (state, action) => {
    var { type, payload } = action;
    switch (type) {
        case 'set-left':
            return { ...state, leftId: payload };
        case 'set-right':
            return { ...state, rightId: payload };
        case 'set-items':
            var { leftId, rightId } = state;

            var next = { ...state, items: payload };
            var ids = payload.map(it => it._id);

            if (!ids.includes(state.leftId)) {
                next.leftId = without(ids, rightId)[0];
            }
            if (!ids.includes(state.rightId)) {
                next.rightId = without(ids, leftId)[0];
            }
            return next;
    }
}


export default Inspector;
