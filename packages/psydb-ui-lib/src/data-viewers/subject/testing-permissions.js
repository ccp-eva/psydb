import React from 'react';
import * as enums from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Icons } from '@mpieva/psydb-ui-layout';
import {
    ForeignId,
    ExtBool,
} from '../utility-components';

const TestingPermissions = (ps) => {
    var { value, related } = ps;
    var translate = useUITranslation();

    if (value.length < 1) {
        return (
            <i className='text-muted'>{ translate('None') }</i>
        )
    }

    return (
        value.map((it, ix) => (
            <ResearchGroupTestingPermissions
                key={ ix }
                value={ it }
                related={ related }
            />
        ))
    )
}

const ResearchGroupTestingPermissions = (ps) => {
    var { value, related } = ps;
    var { researchGroupId, permissionList } = value;
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
                { permissionList.map((it, ix) => (
                    <PermissionItem
                        key={ ix }
                        value={ it }
                    />
                ))}
            </div>
        </div>
    )
}

const PermissionItem = (ps) => {
    var { labProcedureTypeKey, value } = ps.value;
    var translate = useUITranslation();

    if (value === 'unknown') {
        return null;
    }
    
    var colorClasses = {
        'yes': 'text-primary',
        'no': 'text-danger',
        'unknown': 'text-grey',
    };

    var icons = {
        'yes': Icons.CheckSquareFill,
        'no': Icons.XSquareFill,
        'unknown': Icons.Square
    }
    
    var OptionIcon = icons[value];
    return (
        <span className={ `d-inline-block mr-4` }>
            <OptionIcon
                className={ colorClasses[value] }
                style={{ marginTop: '-3px' }}
            />
            <span className='d-inline-block ml-2'>
                { translate(
                    enums.experimentVariants.getLabel(labProcedureTypeKey)
                )}
            </span>
        </span>
    )
}

export default TestingPermissions;
