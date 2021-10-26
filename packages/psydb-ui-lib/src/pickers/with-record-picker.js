import React  from 'react';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { usePickerHandling } from './use-picker-handling';
import { PickerInput } from './picker-input';


export const withRecordPicker = (options) => {
    var { RecordList } = options;
    
    var RecordPickerModalBody = (ps) => (
        <RecordList { ...ps } />
    );

    var RecordPickerModal = WithDefaultModal({
        title: 'Auswählen',
        size: 'lg',
        className: '',
        backdropClassName: '',
        bodyClassName: 'bg-light pt-0 pr-3 pl-3',

        Body: RecordPickerModalBody
    })

    var RecordPicker = (ps) => {
        var {
            value: record,
            hasErrors,
            disabled,
            canClear = true,
            idLabelProp = '_id',

            onChange,
            ...downstream
        } = ps;

        var {
            modal, cached, onEdit, onSelect, onClear
        } = usePickerHandling({ record, onChange });

        var displayValue = (
            cached
            ? cached._recordLabel || cached[idLabelProp]
            : ''
        )

        return (
            <div>
                <RecordPickerModal { ...({
                    ...modal.passthrough,
                    ...downstream,
                    onSelect,
                })} />

                <PickerInput { ...({
                    displayValue,
                    disabled,
                    hasErrors,
                    hasInvalidRecord: cached && !cached._recordLabel,
                    canClear: cached && canClear,

                    onEdit,
                    onClear,
                })} />

            </div>
        );
    }

    return RecordPicker;
}
