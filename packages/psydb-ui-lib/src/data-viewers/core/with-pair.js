import React from 'react';
//import { Pair } from '@mpieva/psydb-ui-layout';
import { useThemeContext } from './theme-context';

export const withPair = (Component) => {
    var PairWrapper = (ps) => {
        var { value, ...pass } = ps;
        var context = useThemeContext();
        var { Field } = context;
        
        var content;
        if (Component) {
            return (
                <Field { ...pass } handleMissing='throw'>
                    <Component value={ value } { ...pass } />
                </Field>
            )
        }
        else {
            return (
                <Field { ...pass }>
                    { value }
                </Field>
            )
        }
    }
    return PairWrapper;
}
