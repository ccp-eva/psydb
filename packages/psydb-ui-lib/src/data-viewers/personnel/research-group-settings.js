import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    ForeignId,
    ExtBool,
} from '../utility-components';

const ResearchGroupSettings = (ps) => {
    var translate = useUITranslation();
    var { value, related } = ps;
    if (value.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
    }

    return (
        value.map((it, ix) => (
            <ResearchGroupWithRole
                key={ ix }
                value={ it }
                related={ related }
            />
        ))
    )
}

const ResearchGroupWithRole = (ps) => {
    var translate = useUITranslation();
    var { value, related } = ps;
    console.log(value);
    var { researchGroupId, systemRoleId } = value;
    return (
        <div className='d-flex px-3 py-2 border mb-1'>
            <header style={{ width: '20%' }}>
                <ForeignId
                    value={ researchGroupId }
                    props={{ collection: 'researchGroup' }}
                    related={ related }
                />
            </header>
            <div>
                { translate('Role') }:
                {' '}
                <ForeignId
                    value={ systemRoleId }
                    props={{ collection: 'systemRole' }}
                    related={ related }
                />
            </div>
        </div>
    )
}

export default ResearchGroupSettings;
