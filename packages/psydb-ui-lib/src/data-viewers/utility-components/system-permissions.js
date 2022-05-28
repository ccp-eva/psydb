import React from 'react';
import { useThemeContext } from '../core/theme-context';
import {
    ForeignId,
    DefaultBool
} from './static';

export const SystemPermissions = (ps) => {
    var { value, related } = ps;
    var { Field } = useThemeContext();

    return (
        <>
            <Field label='Zugriff auf diesen Datensatz für'>
                { value.accessRightsByResearchGroup.map((it, ix) => (
                    <SystemPermissionItem
                        key={ ix }
                        value={ it }
                        related={ related }
                    />
                ))}
            </Field>
            <Field label='Ausgeblendet'>
                <DefaultBool value={ value.isHidden } />
            </Field>
        </>
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
