import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useThemeContext } from '../core/theme-context';
import {
    ForeignId,
} from './static';

export const SystemPermissions = (ps) => {
    var { value, related } = ps;
    var translate = useUITranslation();
    var { Field } = useThemeContext();

    return (
        <>
            <Field label={ translate('Record Access for') }>
                { value.accessRightsByResearchGroup.map((it, ix) => (
                    <SystemPermissionItem
                        key={ ix }
                        value={ it }
                        related={ related }
                    />
                ))}
            </Field>
        </>
    );
}

const SystemPermissionItem = (ps) => {
    var { value, related } = ps;
    var { researchGroupId, permission } = value;
    
    var translate = useUITranslation();
    
    var permissionOptions = {
        'read': translate('Read'),
        'write': translate('Write')
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
