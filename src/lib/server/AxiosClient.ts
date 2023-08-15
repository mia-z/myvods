import axios from "axios";
import logger from "./Logger";

const client = axios.create({
    validateStatus: () => true,
});

client.interceptors.response.use(
    (res) => {
        logger.info({ source: "Axios/Response", text: `Got ${res.status} response from: ${res.config.url}` });
        if (res.status >= 400) {
            logger.error({ source: "Axios/Response", text: `Error response ${res.data.status} with message: ${res.data.message}` });
        }
        return res;
    },
    (error: Error) => {
        logger.error({ source: "Axios/Response", text: `Exception: ${error.message}` });
        return error;
    }
);

client.interceptors.request.use(
    (req) => {
        logger.info({ source: "Axios/Request", text: `Sending request to: ${req.url}` });
        return req;
    },
    (error: Error) => {
        logger.error({ source: "Axios/Request", text: `Exception: ${error.message}` });
        return error;
    }
);

export default client;