import React, { useState, useEffect, useReducer } from 'react';
import { ArrowUpShort, ArrowDownShort, Plus, X } from 'react-bootstrap-icons';

const ArrayFieldTemplate = (ps) => {
    var {
        schema
    } = ps;
    console.log(ps);

    var Variant = subTemplates[schema.systemType];
    if (!Variant) {
        Variant = subTemplates.Plain
    }

    return (
        <Variant { ...ps } />
    )
}

const DefaultArrayItem = (ps) => {
    console.log(ps);
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

    return (
        <div className='border p-3' style={{
            position: 'relative',
            marginBottom: '33px'
        }}>
            { children }
            
            { (index === itemsCount - 1) && (
                <AddButtonWrapper>
                    <AddButton onClick={ onAddClick }>
                        <Plus />
                    </AddButton>
                </AddButtonWrapper>
            )}

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

const AddButtonWrapper = ({ children }) => (
    <div
        role='button'
        className='d-flex'
        style={{
            background: '#006066',
            bottom: -23,
            left: -1,
            position: 'absolute',
        }}
    >
        { children }
    </div>
);

const MoveButtonWrapper = ({ children }) => (
    <div
        role='button'
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

const AddButton = ({ children, onClick, style }) => (
    <div
        onClick={ onClick }
        style={{
            color: '#ffffff',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
            ...style,
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

const MoveButton = ({ children, onClick }) => (
    <div
        onClick={ onClick }
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        className=' border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

const RemoveButton = ({ children, onClick }) => (
    <div
        className='border d-flex align-items-center justify-content-center'
        style={{
            color: '#c00',
            //border: '1px solid #c00',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
        }}
        onClick={ onClick }
    >
        { children }
    </div>
)

const Plain = (ps) => {
    var {
        items,
        title,
        schema,
        formData,
        onAddClick,
    } = ps;

    var itemsCount = items.length;

    return (
        <div className='row mr-0 ml-0'>
            <header className='col-sm-3'>
                { title }
            </header>
            <div className='col-sm-9 p-0'>
                { items && items.map((itemProps) => (
                    <DefaultArrayItem
                        { ...itemProps }
                        schema={ schema }
                        formData={ formData }
                        itemsCount={ itemsCount }
                        onAddClick={ onAddClick }
                    />
                ))}
                { itemsCount === 0 && (
                    <div className='border p-3' style={{
                        position: 'relative',
                        marginBottom: '33px'
                    }}>
                        <div className='text-muted' style={{ paddingLeft: '15px' }}>
                            Keine Einträge
                        </div>
                        <AddButtonWrapper>
                            <AddButton onClick={ onAddClick }>
                                <Plus />
                            </AddButton>
                        </AddButtonWrapper>
                    </div>
                )}
            </div>
        </div>
    )
}

const subTemplates = {
    Plain,
};

export default ArrayFieldTemplate;
