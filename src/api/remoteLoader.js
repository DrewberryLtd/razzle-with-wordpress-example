import axios from 'axios';
import { WP_END_POINT } from '../../config';

export const remoteLoader = (callback, route, endPoint) => {
    let instanceParams = {
        baseURL: WP_END_POINT
    };

    const instance = axios.create(instanceParams);

    instance
        .get(route, {
            validateStatus: function(status) {
                return status < 500; // Reject only if the status code is greater than or equal to 500
            }
        })
        .then(res => {
            //sets it up for node based redirects
            if (!!res.data.redirect) {
                res.headers.location = res.data.redirect;
                res.status = 301;
            }

            return callback(res);
        })
        .catch(err => {
            console.log('Error Fetching API');
            return callback(false);
        });
};
