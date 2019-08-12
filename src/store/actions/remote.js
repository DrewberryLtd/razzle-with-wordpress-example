import { remoteLoader } from '../../api/remoteLoader';

export const FETCH_DATA_START = 'FETCH_DATA_START';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL';

export const fetchDataSuccess = result => ({
    type: FETCH_DATA_SUCCESS,
    data: result
});

export const fetchDataStart = (apiName) => ({
    type: FETCH_DATA_START,
    apiName: apiName
});

export const fetchDataFail = (apiName) => ({
    type: FETCH_DATA_FAIL,
    apiName: apiName
});

export const fetchData = (route, apiName) => dispatch => {
    dispatch(fetchDataStart(apiName));
    remoteLoader(
        res => {
            if (res) {
                dispatch({
                    type: FETCH_DATA_SUCCESS,
                    payload: res.data,
                    apiName: apiName,
                    route : route
                });
            } else {
                dispatch({
                    type: FETCH_DATA_FAIL,
                    apiName: apiName,
                    route : route
                });
            }
        },
        route,
        apiName
    );
};
