import { demuxed } from '@mpieva/psydb-ui-utils';
import useSend from './use-send';

const useSendPatch = (options) => {
    var {
        collection,
        recordType,
        record,
        subChannels,
        additionalPayloadProps,
        onSuccessfulUpdate,
        autoPayload = true,
        __noLastKnownEventId = false,
        ...otherOptions
    } = options;

    var send = useSend((data, formikBag, moreAdditionalPayloadProps) => ({
        type: (
            recordType
            ? `${collection}/${recordType}/patch`
            : `${collection}/patch`
        ),
        ...(autoPayload ? {
            payload: {
                id: record._id,
                ...(!__noLastKnownEventId && (
                    createEventIdProps(record, subChannels)
                )),
                props: data,
                ...additionalPayloadProps,
                ...moreAdditionalPayloadProps,
            }
        } : {
            payload: data
        })
    }), {
        onSuccessfulUpdate: (response) => {
            var recordId = response.data.data.find(it => (
                it.collectionName === collection
            )).channelId;
            demuxed([ onSuccessfulUpdate ])({ id: recordId, response })
        }
    });

    return send;
}

const createEventIdProps = (record, subChannels) => (
    subChannels
    ? { lastKnownSubChannelEventIds: (
        subChannels.reduce((acc, chan) => ({
            ...acc,
            ...(record[chan] && { [chan]: record[chan]._lastKnownEventId})
        }), {})
    )}
    : { lastKnownEventId: record._lastKnownEventId }
)

export default useSendPatch;
