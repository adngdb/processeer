import {
    VISIT_EDIT_VIEW_PAGE,
    VISIT_EDIT_BLOCK_PAGE,
} from '../actions/history.jsx';


export default function history(state = {
    view: null,
    block: null,
}, action) {
    switch (action.type) {
    case VISIT_EDIT_VIEW_PAGE:
        return Object.assign({}, state, {
            view: action.id,
        });
    case VISIT_EDIT_BLOCK_PAGE:
        return Object.assign({}, state, {
            block: action.id,
        });
    default:
        return state;
    }
}
