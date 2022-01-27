import useWriteRequest from './use-write-request';

const useSend = (
    createMessage,
    options = {}
) => {
    var { disableErrorModal = false, ...writeOptions } = options;
    var send = useWriteRequest((agent, ...args) => (
        agent.send({
            message: createMessage(...args),
            extraAxiosConfig: { disableErrorModal }
        })
    ), writeOptions);

    return send;
}

export default useSend;
