import axios from "axios";
import logger from "./Logger";

const client = axios.create({
    validateStatus: () => true,
});

client.interceptors.response.use(
    (res) => {
        logger.info({ source: "Axios/Response", text: `Got ${res.status} response from: ${res.config.url}` });
        if (res.status >= 400) {
            console.log(res)
            logger.error({ source: "Axios/Response", text: `Error response ${res.status} with message: ${res.data.error}` });
        }
        return res;
    },
    (error: Error) => {
        console.log(error)
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