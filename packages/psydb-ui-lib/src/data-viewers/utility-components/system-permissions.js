import React from 'react';
import {
    ForeignId
} from './static';

export const SystemPermissions = (ps) => {
    var { value, related } = ps;
    return (
        value.accessRightsByResearchGroup.map((it, ix) => (
            <SystemPermissionItem
                key={ ix }
                value={ it }
                related={ related }
            />
        ))
    );
}

const SystemPermissionItem = (ps) => {
    var { value, related } = ps;
    var { researchGroupId, permission } = value;
    
    var permissionOptions = {
        'read': 'Lesen',
        'write': 'Schreiben'
    };

    return (
        <div>
            <ForeignId
                value={ researchGroupId }
                props={{ collection: 'researchGroup' }}
                related={ related }
            />
            {' '}
            ({ permissionOptions[permission] })
        </div>
    )
}
