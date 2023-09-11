import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
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

    var translate = useUITranslation();

    if (!selectedStudy) {
        return null; // FIXME: better failover
    }

    return (
        <SplitPartitioned partitions={[ 2.3, 11 ]}>
            <b className='d-inline-block' style={{ paddingTop: '2px' }}>
                { translate('Appointment Type') }:
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
            return 'Inhouse Appointment'
        case 'online-video-call':
            return 'Online Video Appointment'
        case 'away-team':
            return 'External Appointment'
    }
}

export default SelectableProcedures;
