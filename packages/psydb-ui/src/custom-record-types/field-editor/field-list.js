import React from 'react';

import {
    Button,
    Table,
    EditIconButton,
    RemoveIconButton
} from '@mpieva/psydb-ui-layout';

import allSchemaCreators from '@mpieva/psydb-schema-creators';

const FieldList = ({
    record,
    onEditField,
    onRemoveField,
    onRestoreField,
}) => {

    var {
        hasSubChannels,
        subChannelKeys,
    } = allSchemaCreators[record.collection];

    var nextSettings = record.state.nextSettings;
    var nextFields = [];
    if (hasSubChannels) {
        for (var key of subChannelKeys) {
            nextFields = [
                ...nextFields,
                ...nextSettings.subChannelFields[key].map(it => ({
                    ...it,
                    subChannelKey: key
                }))
            ]
        }
    }
    else {
        nextFields = nextSettings.fields;
    }

    return (
        <Table size='md'>
            <thead>
                <tr>
                    <th>DisplayName</th>
                    <th>Internal Key</th>
                    <th>Type</th>
                    { hasSubChannels && (
                        <th>SubChannel</th>
                    )}
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { nextFields.map(field => (
                    <Row { ...({
                        key: field.key,
                        field,
                        hasSubChannels,
                        onEditField,
                        onRemoveField,
                        onRestoreField,
                    }) }/>
                )) }
            </tbody>
        </Table>
    );
}

const Row = ({
    field,
    hasSubChannels,
    onEditField,
    onRemoveField,
    onRestoreField,
}) => {
    var className = [];
    var style = {};
    if (field.isRemoved) {
        style.color = '#ccc';
    }
    className = className.join(' ');

    return (
        <tr style={ style } className={ className }>
            <td>
                { field.displayName }
                { field.isDirty && (
                    <span className='text-danger'>
                        { field.isNew ? ' (neu)' : ' (bearbeitet)' }
                    </span>
                )}
            </td>
            <td>{ field.key }</td>
            <td>{ field.type }</td>
            { hasSubChannels && (
                <td>{ field.subChannelKey }</td>
            )}
            <td className='d-flex justify-content-end'>
                { field.isRemoved
                    ? (
                        <Button
                            size='sm'
                            onClick={ () => onRestoreField({ field })}
                        >
                            Restore
                        </Button>
                    )
                    : (
                        <>
                            <EditIconButton
                                onClick={ () => onEditField({ field }) }
                            />
                            <RemoveIconButton
                                onClick={ () => onRemoveField({ field }) }
                            />
                        </>
                    )
                }
            </td>
        </tr>
    )
}

export default FieldList;
