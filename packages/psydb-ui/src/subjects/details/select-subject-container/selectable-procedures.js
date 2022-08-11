import React from 'react';
import {
    SplitPartitioned,
    PillNav
} from '@mpieva/psydb-ui-layout';


const SelectableProcedures = (ps) => {
    var {
        selectedStudy,
        selectedProcedure,
        onSelect
    } = ps;

    if (!selectedStudy) {
        return null; // FIXME: better failover
    }

    return (
        <SplitPartitioned partitions={[ 2, 10 ]}>
            <b className='d-inline-block' style={{ paddingTop: '2px' }}>
                Termin-Typ:
            </b>
            <PillNav
                items={ selectedStudy._possibleProcedures.map(it => ({
                    key: it,
                    label: getProcedureLabel(it)
                })) }
                activeKey={ selectedProcedure }
                onItemClick={ onSelect }
            />
        </SplitPartitioned>
    )
}

const getProcedureLabel = (key) => {
    switch (key) {
        case 'inhouse':
            return 'Interner Termin'
        case 'online-video-call':
            return 'Video Termin'
        case 'away-team':
            return 'Externer Termin'
    }
}

export default SelectableProcedures;
