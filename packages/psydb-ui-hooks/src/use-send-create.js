import { demuxed } from '@mpieva/psydb-ui-utils';
import useSend from './use-send';

const useSendCreate = (options) => {
    var {
        collection,
        recordType,
        onSuccessfulUpdate,
        additionalPayloadProps,
        ...otherOptions
    } = options;

    var send = useSend((props) => ({
        type: (
            recordType
            ? `${collection}/${recordType}/create`
            : `${collection}/create`
        ),
        payload: {
            props,
            ...additionalPayloadProps
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

export default useSendCreate;
