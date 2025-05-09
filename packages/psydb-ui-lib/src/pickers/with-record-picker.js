import React, { useState }  from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { usePickerHandling } from './use-picker-handling';
import { PickerInput } from './picker-input';
import { StudyTopicPickerView } from './study-topic-picker-view';


export const withRecordPicker = (options) => {
    var { RecordList, modalSize } = options;

    var DefaultModalView = (ps) => {
        var { collection, recordType } = ps;

        // FIXME: for collection w/o crts i dont need to fetch
        var [ didFetch, fetched] = useFetch((agent) => (
            agent.fetchCollectionCRTs({ collection })
        ), []);

        if (!didFetch) {
            return null;
        }

        if (!recordType) {
            if (fetched.data.length === 1) {
                recordType = fetched.data[0].type;
            }
            // TODO: for crts with multiple types
            // we need to create select ui and render that
        }

        return (
            <RecordList { ...ps } recordType={ recordType } />
        )
    }

    var TopicModalView = (ps) => (
        <StudyTopicPickerView { ...ps } />
    );
    
    var RecordPickerModalBody = (ps) => (
        ps.collection === 'studyTopic'
        ? <TopicModalView { ...ps } />
        : <DefaultModalView { ...ps } />
    );

    var RecordPickerModal = WithDefaultModal({
        title: '_record_picker_modal_title',
        size: 'xl',
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
            readOnly = false,
            canClear = true,
            idLabelProp = '_id',

            modalSize,

            collection,
            recordType,
            onChange,
            ...downstream
        } = ps;

        var {
            modal, cached, onEdit, onSelect, onClear
        } = usePickerHandling({ record, onChange });

        var hasInvalidRecord = cached && !cached._recordLabel;
        var displayValue = (
            cached
            ? cached._recordLabel || cached[idLabelProp]
            : ''
        );
        //console.log(collection, record, hasInvalidRecord);

        var [ fetchedRecord, setFetchedRecord ] = useState();
        var shouldRefetch = (
            record?._id != fetchedRecord?._id
        );

        var [ didFetch, fetched ] = useFetch((agent) => (
            shouldRefetch && cached
            ? agent.readRecord({
                collection,
                id: cached._id
            })
            : undefined
        ), {
            extraEffect: (response) => {
                //console.log(response);
                if (response?.data?.data?.record) {
                    setFetchedRecord(response.data.data.record)
                }
                else {
                    setFetchedRecord(undefined)
                }
            },
            dependencies: [ record?._id ]
        });

        if (!didFetch) {
            return null;
        }

        var recordId = undefined;
        if (fetched) {
            if (
                fetched.data && fetched.data.record
                && cached && !cached._recordLabel // FIXME: hasInvalidRecord
            ) {
                recordId = fetched.data.record._id;
                displayValue = fetched.data.record._recordLabel;
                hasInvalidRecord = false;
            }
            else {
                recordId = (
                    cached ? cached._id : undefined
                );
                displayValue = (
                    cached
                    ? cached._recordLabel || cached[idLabelProp]
                    : ''
                )
            }
        }

        return (
            <div>
                <RecordPickerModal { ...({
                    ...modal.passthrough,
                    ...downstream,
                    extraIds: recordId ? [ recordId ] : [],
                    collection,
                    recordType,
                    onSelect,

                    modalSize
                })} />

                <PickerInput { ...({
                    collection,
                    recordType,
                    recordId,
                    displayValue,
                    disabled,
                    readOnly,
                    hasErrors,
                    hasInvalidRecord,
                    canClear: cached && canClear,

                    onEdit,
                    onClear,
                })} />

            </div>
        );
    }

    return RecordPicker;
}
