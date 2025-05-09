import { demuxed } from '@mpieva/psydb-ui-utils';
import useSend from './use-send';

const useSendRemove = (options) => {
    var {
        collection,
        recordType,
        record,
        subChannels,
        additionalPayloadProps,
        onSuccessfulUpdate,
        ...otherOptions
    } = options;

    var send = useSend((props) => ({
        type: (
            recordType
            ? `${collection}/remove`
            : `${collection}/remove`
        ),
        payload: {
            id: record._id,
            ...createEventIdProps(record, subChannels),
        }
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

export default useSendRemove;
