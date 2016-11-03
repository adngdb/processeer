import { combineReducers } from 'redux';

import { RECEIVE_CREATED_REPORT } from '../actions/reports.jsx';

import blocks from './blocks.jsx';
import reports from './reports.jsx';
import history from './history.jsx';


function created(state = {
    report: null,
    block: null,
}, action) {
    switch (action.type) {
    case RECEIVE_CREATED_REPORT:
        return Object.assign({}, state, {
            report: action.id,
        });
    default:
        return state;
    }
}


const rootReducer = combineReducers({
    reports,
    blocks,
    history,
    created,
});

export default rootReducer;
