import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowUpShort, ArrowDownShort, X, Plus } from 'react-bootstrap-icons';
import * as wrappers from '../utility-components/wrappers';

const ScalarVariant = (ps) => {
    var {
        id,
        items,
        title,
        schema,
        formData,
        onAddClick,
        rawErrors = [],
    } = ps;

    var {
        systemType,
        systemProps = {}
    } = schema;

    var Wrapper = wrappers[systemProps.uiWrapper];
    if (!Wrapper) {
        Wrapper = wrappers.InlineArrayWrapper;
    }

    var hasErrors = !!rawErrors.length;
    var itemsCount = items.length;

    return (
        <Wrapper { ...({
            id, schema, rawErrors,
            label: title,
            required: false
        }) }>
            <ol className='border p-3'>
                { items && items.map((itemProps) => (
                    <ArrayItem
                        { ...itemProps }
                        schema={ schema }
                        formData={ formData }
                        itemsCount={ itemsCount }
                    />
                ))}
                { itemsCount === 0 && (
                    <div className='text-muted'>
                        <i>Keine Einträge</i>
                    </div>
                )}
                <div className='mt-3'>
                    <AddButton onClick={ onAddClick }>
                        <Plus />
                    </AddButton>
                </div>
            </ol>
        </Wrapper>
    )
}

const AddButton = ({ children, onClick, style }) => (
    <div
        onClick={ onClick }
        role='button'
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '100px',
            ...style,
        }}
        className=' border d-flex align-items-center justify-content-center bg-white'
    >
        { children }
    </div>
)

var ArrayItem = (ps) => {
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
        <li className={
            `ml-3 pl-2 ${isLastItem ? '' : 'mb-3'}`
        }>
            <div className='d-flex align-items-center'>
                <div className='flex-grow mr-3'>
                    { children }
                </div>

                <div
                    className='d-flex justify-content-end flex-row-reverse'
                    style={{ width:'120px' }}
                >
                    { hasMoveUp && (
                        <MoveButton onClick={
                            onReorderClick(index, index - 1)
                        }>
                            <ArrowUpShort style={{
                                width: '24px',
                                height: '24px',
                                marginTop: '1px'
                            }} />
                        </MoveButton>
                    )}
                    { hasMoveDown && (
                        <MoveButton onClick={
                            onReorderClick(index, index + 1)
                        }>
                            <ArrowDownShort style={{
                                width: '24px',
                                height: '24px',
                                marginTop: '1px'
                            }} />
                        </MoveButton>
                    )}
                    { hasRemove && (
                        <RemoveButton onClick={
                            onDropIndexClick(index)
                        }>
                            <X style={{
                                width: '24px',
                                height: '24px',
                                marginTop: '1px'
                            }} />
                        </RemoveButton>
                    )}
                </div>
            </div>
        </li>
    );
}

export const MoveButton = ({ children, onClick }) => (
    <div
        onClick={ onClick }
        role='button'
        style={{
            color: '#006066',
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '42px',
            height: '38px',
        }}
        className='bg-white border d-flex align-items-center justify-content-center'
    >
        { children }
    </div>
)

export const RemoveButton = ({ children, onClick }) => (
    <div
        onClick={ onClick }
        role='button'
        style={{
            paddingTop: '3px',
            paddingBottom: '3px',
            width: '42px',
            height: '38px',
        }}
        className='bg-white border d-flex align-items-center justify-content-center text-danger'
    >
        { children }
    </div>
)

export default ScalarVariant;
