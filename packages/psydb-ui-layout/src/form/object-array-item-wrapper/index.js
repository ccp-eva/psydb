import React from 'react';
import classnames from 'classnames';
import * as Icons from '../../icons';

import {
    MoveButtonWrapper,
    MoveButton,

    RemoveButton,
} from '../array-item-buttons';

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

    var moveUp = () => formikArrayHelpers.swap(index, index - 1);
    var moveDown = () => formikArrayHelpers.swap(index, index + 1);
    var remove = () => formikArrayHelpers.remove(index);
    
    return (
        <MoveButtonWrapper>
            { hasMoveUp && (
                <MoveButton onClick={ moveUp } disabled={ disabled }>
                    <Icons.ArrowUpShort />
                </MoveButton>
            )}
            { hasMoveDown && (
                <MoveButton onClick={ moveDown } disabled={ disabled }>
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
