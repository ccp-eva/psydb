import React from 'react';
import allSchemaCreators from '@mpieva/psydb-schema-creators';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import {
    Button,
    Table,
    EditIconButton,
    RemoveIconButton
} from '@mpieva/psydb-ui-layout';

const FieldList = ({
    record,
    onEditField,
    onRemoveField,
    onRestoreField,
}) => {
    var translate = useUITranslation();

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
                    <th>{ translate('Display Name') }</th>
                    <th>{ translate('Internal Key') }</th>
                    <th>{ translate('Type') }</th>
                    { hasSubChannels && (
                        <th>{ translate('Data Channel') }</th>
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
    var translate = useUITranslation();
    
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
                        {' '}
                        { field.isNew ? (
                            translate('(new)')
                        ): (
                            translate('(edited)')
                        )}
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
                            { translate('Restore') }
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
