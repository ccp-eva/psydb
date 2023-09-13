import React from 'react';
import classnames from 'classnames';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as Icons from '../../icons';
import { ErrorIndicator } from '../error-indicator';

export const ScalarArrayItemWrapper = (ps) => {
    var {
        formikArrayHelpers,
        index,
        lastIndex,
        disabled,
        enableMove = true,
        enableRemove = true,
        children,

        formikMeta = {}
    } = ps;

    var { error } = formikMeta;

    var className = classnames([
        'ml-3 pl-2',
        !(index === lastIndex) && 'mb-3'
    ]);

    var hasRemove = enableRemove;
    var hasMoveUp = enableMove && (index > 0);
    var hasMoveDown = enableMove && (index < lastIndex);

    return (
        <li className={ className }>
            <div className='d-flex align-items-center'>
                <div className='flex-grow mr-3'>
                    { children }
                </div>

                <Aside { ...({
                    index,
                    formikArrayHelpers,
                    hasMoveUp,
                    hasMoveDown,
                    hasRemove,
                    disabled
                })} />

            </div>
            <ErrorIndicator { ...ps } />
        </li>
    );
}

var Aside = (ps) => {
    var {
        index,
        disabled,
        formikArrayHelpers,
        hasMoveUp,
        hasMoveDown,
        hasRemove,
    } = ps;

    var translate = useUITranslation();

    var moveUp = () => formikArrayHelpers.swap(index, index - 1);
    var moveDown = () => formikArrayHelpers.swap(index, index + 1);
    var remove = () => formikArrayHelpers.remove(index);

    var buttonCount = (
        (hasMoveUp ? 1 : 0) +
        (hasMoveDown ? 1 : 0) +
        (hasRemove ? 1 : 0)
    );

    var width = buttonCount * 40;

    return (
        <div
            className='d-flex justify-content-end flex-row-reverse'
            style={{ width: `${width}px` }}
        >
            { hasMoveUp && (
                <MoveButton
                    onClick={ moveUp } disabled={ disabled }
                    title={ translate('_form_array_moveup_button') }
                >
                    <Icons.ArrowUpShort style={{
                        width: '24px',
                        height: '24px',
                        marginTop: '1px'
                    }} />
                </MoveButton>
            )}
            { hasMoveDown && (
                <MoveButton
                    onClick={ moveDown } disabled={ disabled }
                    title={ translate('_form_array_moveup_button') }
                >
                    <Icons.ArrowDownShort style={{
                        width: '24px',
                        height: '24px',
                        marginTop: '1px'
                    }} />
                </MoveButton>
            )}
            { hasRemove && (
                <RemoveButton onClick={ remove } disabled={ disabled }>
                    <Icons.X style={{
                        width: '24px',
                        height: '24px',
                        marginTop: '1px'
                    }} />
                </RemoveButton>
            )}
        </div>
    )
}

const MoveButton = ({ children, onClick, disabled, title }) => (
    <button
        type='button'
        role={ disabled ? '': 'button' }
        onClick={ disabled ? undefined : onClick }
        style={{
            color: disabled ? '#ccc' : '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '42px',
            height: '38px',
        }}
        className='bg-white border d-flex align-items-center justify-content-center'
        title={ title }
    >
        { children }
    </button>
)

const RemoveButton = (ps) => {
    var { children, onClick, disabled } = ps;
    var translate = useUITranslation();
    return (
        <button
            type='button'
            role={ disabled ? '': 'button' }
            onClick={ disabled ? undefined : onClick }
            style={{
                color: disabled ? '#ccc' : '#c00',
                paddingTop: '3px',
                paddingBottom: '3px',
                width: '42px',
                height: '38px',
            }}
            className='bg-white border d-flex align-items-center justify-content-center text-danger'
            title={ translate('_form_array_remove_button') }
        >
            { children }
        </button>
    )
}
