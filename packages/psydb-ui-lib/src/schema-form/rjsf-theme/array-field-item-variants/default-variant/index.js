import React from 'react';
import { Icons } from '@mpieva/psydb-ui-layout';

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
                            <Icons.ArrowUpShort />
                        </MoveButton>
                    )}
                    { hasMoveDown && (
                        <MoveButton onClick={
                            onReorderClick(index, index + 1)
                        }>
                            <Icons.ArrowDownShort />
                        </MoveButton>
                    )}
                    { hasRemove && (
                        <RemoveButton
                            onClick={ onDropIndexClick(index) }
                        >
                            <Icons.X />
                        </RemoveButton>
                    )}
                </MoveButtonWrapper>
            )}
        </div>
    )
}


export default DefaultArrayItem;
