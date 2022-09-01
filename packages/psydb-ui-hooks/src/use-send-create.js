import { demuxed } from '@mpieva/psydb-ui-utils';
import useSend from './use-send';

const useSendCreate = (options) => {
    var {
        collection,
        recordType,
        onSuccessfulUpdate,
        onFailedUpdate,
        additionalPayloadProps,
        ...otherOptions
    } = options;

    var send = useSend((props, formikBag, moreAdditionalPayloadProps) => ({
        type: (
            recordType
            ? `${collection}/${recordType}/create`
            : `${collection}/create`
        ),
        payload: {
            props,
            ...additionalPayloadProps,
            ...moreAdditionalPayloadProps
        }
    }), {
        onSuccessfulUpdate: (response) => {
            var recordId = response.data.data.find(it => (
                it.collectionName === collection
            )).channelId;
            demuxed([ onSuccessfulUpdate ])({ id: recordId, response })
        },
        onFailedUpdate,
        ...otherOptions
    });

    return send;
}

export default useSendCreate;
