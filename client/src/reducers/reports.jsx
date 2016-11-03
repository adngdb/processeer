import {
    CLEAR_NEW_REPORT_DATA,
    RECEIVE_REPORT_CONTENT,
    REMOVE_REPORT_CONTENT,
    RECEIVE_REPORT_DELETED,
    RECEIVE_REPORT_META,
    RECEIVE_REPORTS,
    REQUEST_REPORT_META,
    REQUEST_RUNNING_REPORT,
    UPDATE_REPORT,
    UPDATE_REPORT_META,
    UPDATE_REPORT_INPUT,
} from '../actions/reports.jsx';


function report(state = {
    isFetching: false,
    isRunning: false,
    didInvalidate: false,
    isPickingBlock: false,
    id: null,
    blocks: [],
    name: '',
    slug: '',
    input: {},
    title: '',
    content: '',
}, action) {
    switch (action.type) {
    case RECEIVE_REPORT_CONTENT:
        return Object.assign({}, state, {
            isRunning: false,
            id: action.id,
            content: action.content,
            title: action.title,
        });
    case REMOVE_REPORT_CONTENT:
        return Object.assign({}, state, {
            content: null,
        });
    case UPDATE_REPORT:
        return Object.assign({}, state, action.report);
    case RECEIVE_REPORT_META:
    case UPDATE_REPORT_META:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            id: action.id,
            blocks: action.blocks,
            name: action.name,
            slug: action.slug,
        });
    case REQUEST_REPORT_META:
        return Object.assign({}, state, {
            isFetching: true,
            didInvalidate: false,
        });
    case REQUEST_RUNNING_REPORT:
        return Object.assign({}, state, {
            isRunning: true,
        });
    case CLEAR_NEW_REPORT_DATA:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            blocks: [],
            name: '',
            slug: '',
        });
    case UPDATE_REPORT_INPUT:
        return Object.assign({}, state, {
            input: action.input,
        });
    default:
        return state;
    }
}

export default function reports(state = {}, action) {
    let newReports;
    switch (action.type) {
    case RECEIVE_REPORT_CONTENT:
    case UPDATE_REPORT_META:
    case RECEIVE_REPORT_META:
    case REQUEST_REPORT_META:
    case REQUEST_RUNNING_REPORT:
    case UPDATE_REPORT:
    case CLEAR_NEW_REPORT_DATA:
    case UPDATE_REPORT_INPUT:
        return Object.assign({}, state, {
            [action.id]: report(state[action.id], action),
        });
    case RECEIVE_REPORTS:
        newReports = {};
        action.reports.forEach((elem) => {
            const subAction = Object.assign({}, elem, { type: RECEIVE_REPORT_META });
            newReports[subAction.id] = report(state[subAction.id], subAction);
        });
        return newReports;
    case RECEIVE_REPORT_DELETED:
        newReports = Object.assign({}, state);
        if (Object.hasOwnProperty.call(newReports, action.id)) {
            delete newReports[action.id];
        }
        return newReports;
    default:
        return state;
    }
}
