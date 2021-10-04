import agent from '@mpieva/psydb-ui-request-agents';
import arrify from './arrify';
import demuxed from './demuxed';

// FIXME: since introducing dependencies i dont rally like the
// signature of that function anmoyre
// createSend({ createMessage, onXXX, dependencies }) is probably more readable
const createSend = (
    createMessage,
    options = {}
) => {
    var {
        onSuccessfulUpdate,
        onFailedUpdate,
    } = options;
   
    // FIXME: createMessage will change on every render
    // probably; so curretly the dependency checks do nothing
    var send = (...args) => {
        var message = createMessage(...args);
        
        return agent.send({ message })
        .then((response) => {
            if (onSuccessfulUpdate) {
                demuxed(arrify(onSuccessfulUpdate))(response);
            }
        })
        .catch((error) => {
            if (onFailedUpdate) {
                demuxed(arrify(onFailedUpdate))(error);
            }
            else {
                throw error;
            }
        })
    }

    return send;
}

export default createSend;
