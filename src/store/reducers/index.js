import { combineReducers } from 'redux';
import remote from './remote';

const rootReducer = combineReducers({
    remote: remote
});

export default rootReducer;