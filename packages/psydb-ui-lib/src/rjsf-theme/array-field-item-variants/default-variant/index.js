import React from 'react';
import { ArrowUpShort, ArrowDownShort, X } from 'react-bootstrap-icons';

import {
    AddButtonWrapper,
    AddButton,
    MoveButtonWrapper,
    MoveButton,

    RemoveButton,
} from './buttons';

const DefaultArrayItem = (ps) => {
    //console.log(ps);
    var {
        index,
        hasMoveUp,
        hasMoveDown,
        hasRemove,
        onAddClick,
        onReorderClick,
        onDropIndexClick,

        itemsCount,

        children,
        ...other
    } = ps;

    var isLastItem = (index === itemsCount - 1);

    return (
        <div
            className={ `border p-3 ${!isLastItem && 'mb-3'}` }
            style={{
                position: 'relative',
            }}
        >
            { children }
            
            { (hasMoveUp || hasMoveDown || hasRemove) && ( 
                <MoveButtonWrapper>
                    { hasMoveUp && (
                        <MoveButton onClick={
                            onReorderClick(index, index - 1)
                        }>
                            <ArrowUpShort />
                        </MoveButton>
                    )}
                    { hasMoveDown && (
                        <MoveButton onClick={
                            onReorderClick(index, index + 1)
                        }>
                            <ArrowDownShort />
                        </MoveButton>
                    )}
                    { hasRemove && (
                        <RemoveButton
                            onClick={ onDropIndexClick(index) }
                        >
                            <X />
                        </RemoveButton>
                    )}
                </MoveButtonWrapper>
            )}
        </div>
    )
}


export default DefaultArrayItem;
