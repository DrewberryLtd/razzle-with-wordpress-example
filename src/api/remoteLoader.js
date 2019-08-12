import axios from 'axios';

export const remoteLoader = (callback, route, endPoint) => {

    let instanceParams = {
        //call straight into wp-api - Replace with your API 
        baseURL: `http://clean-wordpress-wagner-silva.dev.drewberry.co.uk/wp-json/drewberry/v1/get-by-slug?slug=`
    }

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
