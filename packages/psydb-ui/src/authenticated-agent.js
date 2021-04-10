import axios from 'axios';

const agent = axios.create();

agent.interceptors.response.use(
    (response) => (response),
    (error) => {
        if (error.response.status === 401) {
            window.location = '/';
            return Promis.resolve();
        }
        else {
            return Promise.reject(error);
        }
    }
)

export default agent;
