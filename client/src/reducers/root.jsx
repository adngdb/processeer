import { combineReducers } from 'redux';

import { RECEIVE_CREATED_VIEW } from '../actions/views.jsx';

import blocks from './blocks.jsx';
import views from './views.jsx';
import history from './history.jsx';


function created(state = {
    view: null,
    block: null,
}, action) {
    switch (action.type) {
    case RECEIVE_CREATED_VIEW:
        return Object.assign({}, state, {
            view: action.id,
        });
    default:
        return state;
    }
}


const rootReducer = combineReducers({
    views,
    blocks,
    history,
    created,
});

export default rootReducer;
