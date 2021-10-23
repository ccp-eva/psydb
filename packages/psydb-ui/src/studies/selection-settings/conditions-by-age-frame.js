import React, { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { EditIconButton } from '@mpieva/psydb-ui-layout';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';

import { AgeFrame } from './age-frame';

import ConditionsByAgeFrameModal from './conditions-by-age-frame-modal';

const ConditionsByAgeFrame = ({
    conditionsByAgeFrame, 
    ...downstream
}) => {

    return (
        <>
            { conditionsByAgeFrame.length === 0 && (
                <div className='p-3 text-muted'>
                    Keine Altersfenster vorhanden
                </div>
            )}
            { conditionsByAgeFrame.map((it, index) => (
                <AgeFrame key={ index } { ...({
                    index,
                    ...it,
                    ...downstream,
                }) } />
            ))}
        </>
    );
}



export default ConditionsByAgeFrame;
