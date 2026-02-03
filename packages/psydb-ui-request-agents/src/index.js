import { default as authenticated } from './authenticated-agent';
import { default as simple } from './public-agent';

const PublicAgent = simple;
const createAgent = authenticated;

export {
    authenticated,
    simple,

    PublicAgent,
    createAgent
}

export default authenticated;
