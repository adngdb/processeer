import {
    VISIT_EDIT_REPORT_PAGE,
    VISIT_EDIT_BLOCK_PAGE,
} from '../actions/history.jsx';


export default function history(state = {
    report: null,
    block: null,
}, action) {
    switch (action.type) {
    case VISIT_EDIT_REPORT_PAGE:
        return Object.assign({}, state, {
            report: action.id,
        });
    case VISIT_EDIT_BLOCK_PAGE:
        return Object.assign({}, state, {
            block: action.id,
        });
    default:
        return state;
    }
}
