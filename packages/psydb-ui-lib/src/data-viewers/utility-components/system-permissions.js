import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useThemeContext } from '../core/theme-context';
import {
    ForeignId,
} from './static';

export const SystemPermissions = (ps) => {
    var { value, related } = ps;
    var [{ translate }] = useI18N();
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
    
    var [{ translate }] = useI18N();
    
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
