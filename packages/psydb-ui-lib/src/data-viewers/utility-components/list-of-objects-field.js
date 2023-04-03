import React from 'react';
import { useThemeContext } from '../core/theme-context';
import { CustomField } from './custom-field';

export const ListOfObjectsField = (ps) => {
    var { value = [], definition, ...pass } = ps;
    
    var context = useThemeContext();
    var { Field } = context;

    return (
        <Field label={ definition.displayName }>
            <div className='p-3 border mb-3'>
                { value.map((it, ix) => (
                    <div key={ ix }>
                        { ix !== 0  && (
                            <hr />
                        )}
                        <ListOfObjectsFieldItem
                            value={ it }
                            definition={ definition }
                            { ...pass }
                        />
                    </div>
                ))}
            </div>
        </Field>
    )
}

const ListOfObjectsFieldItem = (ps) => {
    var { value = {}, definition, ...pass } = ps;
    var { fields } = definition.props;

    return fields.map((it, ix) => (
        <CustomField
            key={ ix }
            value={ value[it.key] }
            definition={ it }
            { ...pass }
        />
    ))
}
