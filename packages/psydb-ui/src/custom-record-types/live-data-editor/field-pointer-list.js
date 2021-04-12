import React, { Fragment, useState, useReducer } from 'react';
import { Table, Button } from 'react-bootstrap';
import {
    ArrowUp,
    ArrowDown,
    XCircle
} from 'react-bootstrap-icons';

const FieldPointerList = ({
    onMoveItem,
    onRemoveItem,
    dataPointers,
    availableFieldDataByPointer,
}) => {
    // TODO: andle move/remove
    if (dataPointers.length < 1) {
        return (
            <p>
                Keine Anzeigefelder festgelegt
            </p>
        )
    }

    return (
        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>DisplayName</th>
                    { (onMoveItem || onRemoveItem) && (
                        <th></th>
                    )}
                </tr>
            </thead>
            <tbody>
                { dataPointers.map((dataPointer, index) => {
                    var {
                        displayName,
                    } = availableFieldDataByPointer[dataPointer];
                    return (
                        <tr key={ dataPointer }>
                            <td>{ index + 1 }</td>
                            <td>{ displayName }</td>
                            { (onMoveItem || onRemoveItem) && (
                                <td>
                                    <ItemActions
                                        index={ index }
                                        onMoveItem={ onMoveItem }
                                        onRemoveItem={ onRemoveItem }
                                    />
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

const ItemActions = ({
    index,
    onMoveItem,
    onRemoveItem
}) => {
    var handleUp = () => (
        onMoveItem({ from: index, to: index - 1 })
    );
    var handleDown = () => (
        onMoveItem({ from: index, to: index + 1 })
    );
    var handleRemove = () => onRemoveItem({ index });

    return (
        <Fragment>
            { onMoveItem && (
                <Fragment>
                    <Button onClick={ handleUp }>
                        <ArrowUp />
                    </Button>
                    <Button onClick={ handleDown }>
                        <ArrowDown />
                    </Button>
                </Fragment>
            )}
            { onRemoveItem && (
                <Button onClick={ handleRemove }>
                    <XCircle />
                </Button>
            )}
        </Fragment>
    )
}

export default FieldPointerList;
