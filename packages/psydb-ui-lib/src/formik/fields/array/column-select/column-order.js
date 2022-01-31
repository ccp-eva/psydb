import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { UpButton, DownButton } from './buttons';

const swap = (ary, a, b) => {
    [ ary[a], ary[b] ] = [ ary[b], ary[a] ];
    return ary;
};

export const ColumnOrder = withField({
    Control: (ps) => {
        var { dataXPath, formikField, formikForm, allOptions } = ps;
        var { value } = formikField;
        var { setFieldValue } = formikForm;

        return (
            <div className='border bg-white'>
                <table className='table table-hover table-borderless table-sm table-selectable m-0'>
                    <tbody>
                        { value.map((it, index) => (
                            <tr key={ it }><td>
                                <ColumnOrderItem
                                    index={ index }
                                    lastIndex={ value.length - 1 }
                                    label={ allOptions[it] }
                                    onSwap={ (a, b) => {
                                        setFieldValue(
                                            dataXPath,
                                            swap([ ...value ], a, b)
                                        )
                                    }}
                                />
                            </td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    },
    DefaultWrapper: 'NoneWrapper',
});

const ColumnOrderItem = (ps) => {
    var { index, lastIndex, label, onSwap } = ps;

    var canMoveUp = index > 0;
    var canMoveDown = index < lastIndex;

    return (
        <div className='d-flex pr-3'>
            <div className='px-3' style={{ width: '35px' }}>
                { index + 1 }.
            </div>
            <div className='px-3 flex-grow-1'>
                { label }
            </div>
            <UpButton
                onClick={ () => onSwap(index, index - 1) }
                disabled={ !canMoveUp }
            />
            <DownButton
                onClick={ () => onSwap(index, index + 1) }
                disabled={ !canMoveDown }
            />
        </div>
    )
}
