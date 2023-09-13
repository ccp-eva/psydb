import React from 'react';
import classnames from 'classnames';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import * as Icons from '../../icons';

export const ObjectArrayItemWrapper = (ps) => {
    var {
        formikArrayHelpers,
        index,
        lastIndex,
        disabled,
        children,
    } = ps;

    var className = classnames([
        'border p-3',
        !(index === lastIndex) && 'mb-3'
    ]);

    var hasRemove = true;
    var hasMoveUp = (index > 0);
    var hasMoveDown = (index < lastIndex);

    var hasFooter = (hasRemove || hasMoveUp || hasMoveDown);

    return (
        <div className={ className } style={{ position: 'relative' }}>
            { children }
            { hasFooter && (
                <Footer { ...({
                    index,
                    formikArrayHelpers,
                    hasMoveUp,
                    hasMoveDown,
                    hasRemove,
                    disabled
                })} />
            )}
        </div>
    );
}

const Footer = (ps) => {
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
    
    return (
        <MoveButtonWrapper>
            { hasMoveUp && (
                <MoveButton
                    onClick={ moveUp } disabled={ disabled }
                    title={ translate('_form_array_moveup_button') }
                >
                    <Icons.ArrowUpShort />
                </MoveButton>
            )}
            { hasMoveDown && (
                <MoveButton
                    onClick={ moveDown } disabled={ disabled }
                    title={ translate('_form_array_movedown_button') }
                >
                    <Icons.ArrowDownShort />
                </MoveButton>
            )}
            { hasRemove && (
                <RemoveButton onClick={ remove } disabled={ disabled }>
                    <Icons.X />
                </RemoveButton>
            )}
        </MoveButtonWrapper>
    );
}

const MoveButtonWrapper = ({ children }) => (
    <div
        className='d-flex'
        style={{
            background: 'white',
            bottom: -1,
            right: -1,
            position: 'absolute',
        }}
    >
        { children }
    </div>
);

const MoveButton = ({ children, onClick, disabled, title }) => (
    <button
        type='button'
        role={ disabled ? '': 'button' }
        onClick={ disabled ? undefined : onClick }
        style={{
            color: disabled ? '#ccc' : '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        className=' border d-flex align-items-center justify-content-center bg-white'
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
            className='border d-flex align-items-center justify-content-center bg-white'
            style={{
                color: disabled ? '#ccc' : '#c00',
                //border: '1px solid #c00',
                paddingTop: '3px',
                paddingBottom: '3px',
                width: '100px',
            }}
            title={ translate('_form_array_remove_button') }
        >
            { children }
        </button>
    )
}

