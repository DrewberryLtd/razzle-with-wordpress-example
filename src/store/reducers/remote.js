import { FETCH_DATA_START, FETCH_DATA_SUCCESS, FETCH_DATA_FAIL } from '../actions/remote';

const initialState = {
    cms: {
        result: null,
        loading: false,
        failed: false
    }
};

/*
 * @param {complex} state
 * @param {complex} action
 */
const remote = (state = initialState, action) => {
    let newState = { ...state };
    switch (action.type) {
        case FETCH_DATA_SUCCESS:
            newState[action.apiName].loading = false;
            newState[action.apiName].failed = false;
            newState[action.apiName].result = action.payload || null;
            break;
        case FETCH_DATA_START:
            newState[action.apiName].loading = true;
            break;
        case FETCH_DATA_FAIL:
            newState[action.apiName].loading = false;
            newState[action.apiName].failed = true;
            break;
        default:
            return state;
    }

    return newState;
};

export default remote;
