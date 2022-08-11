import React, { useState }  from 'react';
import { useFetch } from '@mpieva/psydb-ui-hooks';
import { WithDefaultModal } from '@mpieva/psydb-ui-layout';
import { usePickerHandling } from './use-picker-handling';
import { PickerInput } from './picker-input';
import { StudyTopicPickerView } from './study-topic-picker-view';


export const withRecordPicker = (options) => {
    var { RecordList } = options;

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

        if (fetched) {
            if (
                fetched.data && fetched.data.record
                && cached && !cached._recordLabel // FIXME: hasInvalidRecord
            ) {
                displayValue = fetched.data.record._recordLabel;
                hasInvalidRecord = false;
            }
            else {
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
                    collection,
                    recordType,
                    onSelect,
                })} />

                <PickerInput { ...({
                    displayValue,
                    disabled,
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
