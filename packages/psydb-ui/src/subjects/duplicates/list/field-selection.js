import React from 'react';
import { useI18N, useUIConfig } from '@mpieva/psydb-ui-contexts';
import * as Controls from '@mpieva/psydb-ui-form-controls';

const FieldSelection = (ps) => {
    var { crtSettings, selection } = ps;
    var { dev_subjectDuplicatesSearchFields } = useUIConfig();
    var [{ translate }] = useI18N();

    var definitions = crtSettings.findCustomFields({
        pointer: { $in: dev_subjectDuplicatesSearchFields.child }
    });

    return (
        <div className='d-flex flex-wrap bg-light border p-3 gapx-3 mb-3'>
            <b>{ translate('Inspected Fields') }:</b>
            { definitions.map((it, ix) => (
                <Controls.PlainCheckbox
                    key={ ix }
                    id={ it.pointer }
                    label={ translate.fieldDefinition(it) }
                    value={ selection.value.includes(it.pointer) }
                    onChange={ () => selection.toggle(it.pointer)}
                />
            ))}
        </div>
    )
}

export default FieldSelection;
