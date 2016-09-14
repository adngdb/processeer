import history from './history.jsx';
import { db_views } from './../db.jsx';
import { runReport } from '../actions.jsx';


// ----------------------------------------------------------------------------
export const REQUEST_VIEWS = 'REQUEST_VIEWS';
function requestViews(views) {
    return {
        type: REQUEST_VIEWS,
    };
}

export const RECEIVE_VIEWS = 'RECEIVE_VIEWS';
function receiveViews(views) {
    return {
        type: RECEIVE_VIEWS,
        views,
    };
}

export function fetchViews() {
    return dispatch => {
        dispatch(requestViews());

        db_views.list()
        .then(views => dispatch(receiveViews(views.data)))
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_VIEW_META = 'REQUEST_VIEW_META';
function requestViewMeta(id) {
    return {
        type: REQUEST_VIEW_META,
        id,
    };
}

export const REQUEST_RUNNING_VIEW = 'REQUEST_RUNNING_VIEW';
function requestRunningView(id) {
    return {
        type: REQUEST_RUNNING_VIEW,
        id,
    };
}

export const RECEIVE_VIEW_META = 'RECEIVE_VIEW_META';
function receiveViewMeta(id, view) {
    return {
        type: RECEIVE_VIEW_META,
        id,
        reports: view.reports,
        name: view.name,
        slug: view.slug,
    };
}

export function fetchView(id) {
    return dispatch => {
        dispatch(requestViewMeta(id));

        db_views.get(id)
        .then((view) => {
            dispatch(receiveViewMeta(
                id,
                view.data
            ));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export function runView(id) {
    return dispatch => {
        dispatch(requestRunningView(id));
        dispatch(requestViewMeta(id));

        db_views.get(id)
        .then((view) => {
            dispatch(receiveViewMeta(
                id,
                view.data
            ));
            dispatch(runReports(id, view.data.reports));
        })
        .catch(console.log.bind(console));
    };
}

function runReports(viewId, reports) {
    return dispatch => {
        let promise = Promise.resolve({
            params: {
                models: [
                    {'bug_ids': '1254527'},
                    {'bugId': '1254527'},
                ]
            }
        });

        reports.forEach(reportId => {
            promise = promise.then(input => {
                return dispatch(runReport({id: reportId, input}));
            });
        });

        promise.then(content => {
            dispatch(receiveViewContent(viewId, content, content.title))
        })
        .catch(console.log.bind(console));
    }
}

// ----------------------------------------------------------------------------
export const REQUEST_CREATE_VIEW = 'REQUEST_CREATE_VIEW';
function requestCreateView() {
    return {
        type: REQUEST_CREATE_VIEW,
    };
}

export const RECEIVE_CREATED_VIEW = 'RECEIVE_CREATED_VIEW';
function receiveViewCreated(view) {
    return {
        type: RECEIVE_CREATED_VIEW,
        id: view.id,
    };
}

export const CLEAR_NEW_VIEW_DATA = 'CLEAR_NEW_VIEW_DATA';
function clearNewViewData() {
    return {
        type: CLEAR_NEW_VIEW_DATA,
        id: '_new',
    };
}

export function createView(reports, name, slug) {
    return dispatch => {
        dispatch(requestCreateView());

        let view = {
            reports,
            name,
            slug,
        };

        db_views.create(view)
        .then(res => {
            dispatch(receiveViewCreated(res.data));
            dispatch(clearNewViewData());
            history.push('/edit/view/' + res.data.id);
            return res.data;
        })
        .catch(console.log.bind(console));
    }
}

// ----------------------------------------------------------------------------
export const REQUEST_SAVE_VIEW = 'REQUEST_SAVE_VIEW';
function requestSaveView(id) {
    return {
        type: REQUEST_SAVE_VIEW,
        id,
    };
}

export const RECEIVE_SAVED_VIEW = 'RECEIVE_SAVED_VIEW';
function receiveViewSaved(view) {
    return {
        type: RECEIVE_SAVED_VIEW,
        id: view.id,
    };
}

export function saveView(id, reports, name, slug) {
    return dispatch => {
        dispatch(requestSaveView(id));

        db_views.get(id)
        .then((view) => {
            view.data.reports = reports;
            view.data.name = name;
            view.data.slug = slug;

            db_views.update(view.data)
            .then(receiveViewSaved)
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const REQUEST_DELETE_VIEW = 'REQUEST_DELETE_VIEW';
function requestDeleteView(id) {
    return {
        type: REQUEST_DELETE_VIEW,
        id,
    };
}

export const RECEIVE_VIEW_DELETED = 'RECEIVE_VIEW_DELETED';
function receiveViewDeleted(id) {
    return {
        type: RECEIVE_VIEW_DELETED,
        id,
    };
}

export function deleteView(id) {
    return dispatch => {
        dispatch(requestDeleteView(id));

        db_views.delete(id)
        .then(() => {
            db_views.sync()
            .then(() => dispatch(receiveViewDeleted(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const RECEIVE_VIEW_CONTENT = 'RECEIVE_VIEW_CONTENT';
function receiveViewContent(id, content, title) {
    return {
        type: RECEIVE_VIEW_CONTENT,
        id,
        content,
        title,
    };
}

export const UPDATE_VIEW = 'UPDATE_VIEW';
export function updateView(id, view) {
    return {
        type: UPDATE_VIEW,
        id,
        view,
    };
}
