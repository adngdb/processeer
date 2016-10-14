import { combineReducers } from 'redux';

import {
    RECEIVE_REPORTS,
    RECEIVE_REPORT_META,
    RECEIVE_REPORT_DELETED,
    REQUEST_SAVE_REPORT,
    UPDATE_REPORT,
    UPDATE_REPORT_CONTROLLER,
    UPDATE_REPORT_MODEL,
} from './actions.jsx';
import {
    VISIT_EDIT_VIEW_PAGE,
    VISIT_EDIT_REPORT_PAGE,
} from './actions/history.jsx';
import {
    CLEAR_NEW_VIEW_DATA,
    RECEIVE_CREATED_VIEW,
    RECEIVE_VIEW_CONTENT,
    RECEIVE_VIEW_DELETED,
    RECEIVE_VIEW_META,
    RECEIVE_VIEWS,
    REQUEST_VIEW_META,
    REQUEST_RUNNING_VIEW,
    UPDATE_VIEW,
    UPDATE_VIEW_META,
} from './actions/views.jsx';


function view(state = {
    isFetching: false,
    isRunning: false,
    didInvalidate: false,
    isPickingReport: false,
    id: null,
    reports: [],
    name: '',
    slug: '',
    title: '',
    content: '',
}, action) {
    switch (action.type) {
        case RECEIVE_VIEW_CONTENT:
            return Object.assign({}, state, {
                isRunning: false,
                id: action.id,
                content: action.content,
                title: action.title,
            });
        case UPDATE_VIEW:
            return Object.assign({}, state, action.view);
        case RECEIVE_VIEW_META:
        case UPDATE_VIEW_META:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                id: action.id,
                reports: action.reports,
                name: action.name,
                slug: action.slug,
            });
        case REQUEST_VIEW_META:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
            });
        case REQUEST_RUNNING_VIEW:
            return Object.assign({}, state, {
                isRunning: true,
            });
        case CLEAR_NEW_VIEW_DATA:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                reports: [],
                name: '',
                slug: '',
            });
        default:
            return state;
    }
}

function views(state = {}, action) {
    let newViews;
    switch (action.type) {
        case RECEIVE_VIEW_CONTENT:
        case UPDATE_VIEW_META:
        case RECEIVE_VIEW_META:
        case REQUEST_VIEW_META:
        case REQUEST_RUNNING_VIEW:
        case UPDATE_VIEW:
        case CLEAR_NEW_VIEW_DATA:
            return Object.assign({}, state, {
                [action.id]: view(state[action.id], action)
            });
        case RECEIVE_VIEWS:
            newViews = {};
            action.views.forEach(elem => {
                elem.type = RECEIVE_VIEW_META;
                newViews[elem.id] = view(state[elem.id], elem);
            });
            return newViews;
        case RECEIVE_VIEW_DELETED:
            newViews = Object.assign({}, state);
            if (newViews.hasOwnProperty(action.id)) {
                delete newViews[action.id];
            }
            return newViews;
        default:
            return state;
    }
}

function model(state = {
    endpoint: '',
    params: [],
}, action) {
    switch (action.type) {
        case UPDATE_REPORT_MODEL:
            return Object.assign({}, state, {
                endpoint: action.endpoint,
                params: action.params,
            });
        default:
            return state;
    }
}

function report(state = {
    isFetching: false,
    didInvalidate: false,
    id: null,
    models: [],
    controller: '',
    name: '',
    slug: '',
    title: '',
    content: '',
}, action) {
    switch (action.type) {
        case RECEIVE_REPORT_META:
            return Object.assign({}, state, {
                id: action.id,
                models: action.report.models,
                controller: action.report.controller,
                name: action.report.name,
                slug: action.report.slug,
            });
        case UPDATE_REPORT:
            return Object.assign({}, state, action.report);
        case UPDATE_REPORT_CONTROLLER:
            return Object.assign({}, state, {
                id: action.id,
                controller: action.controller,
            });
        case UPDATE_REPORT_MODEL:
            return Object.assign({}, state, {
                models: state.models.map((item, index) => {
                    if (index === action.modelIndex) {
                        return model(item, action);
                    }
                    return item;
                })
            });
        default:
            return state;
    }
}

function reports(state = {}, action) {
    let newReports;

    switch (action.type) {
        case RECEIVE_REPORT_META:
        case UPDATE_REPORT:
        case UPDATE_REPORT_CONTROLLER:
        case UPDATE_REPORT_MODEL:
            return Object.assign({}, state, {
                [action.id]: report(state[action.id], action)
            });
        case RECEIVE_REPORTS:
            newReports = {};
            action.reports.forEach(elem => {
                let newAction = {
                    type: RECEIVE_REPORT_META,
                    id: elem.id,
                    report: elem,
                };
                newReports[elem.id] = report(state[elem.id], newAction);
            });
            return newReports;
        case RECEIVE_REPORT_DELETED:
            newReports = Object.assign({}, state);
            if (newReports.hasOwnProperty(action.id)) {
                delete newReports[action.id];
            }
            return newReports;
        default:
            return state;
    }
}

function history(state = {
    view: null,
    report: null,
}, action) {
    switch (action.type) {
        case VISIT_EDIT_VIEW_PAGE:
            return Object.assign({}, state, {
                view: action.id,
            });
        case VISIT_EDIT_REPORT_PAGE:
            return Object.assign({}, state, {
                report: action.id,
            });
        default:
            return state;
    }
}

function created(state = {
    view: null,
    report: null,
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
    reports,
    history,
    created,
});

export default rootReducer;
