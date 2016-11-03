import history from './history.jsx';
import { dbViews } from './../db.jsx';
import { runBlock } from '../actions/blocks.jsx';


// ----------------------------------------------------------------------------
export const REQUEST_VIEWS = 'REQUEST_VIEWS';
function requestViews() {
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
    return (dispatch) => {
        dispatch(requestViews());

        dbViews.list()
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
        blocks: view.blocks,
        name: view.name,
        slug: view.slug,
    };
}

export function fetchView(id) {
    return (dispatch) => {
        dispatch(requestViewMeta(id));

        dbViews.get(id)
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
export const RECEIVE_VIEW_CONTENT = 'RECEIVE_VIEW_CONTENT';
function receiveViewContent(id, content, title) {
    return {
        type: RECEIVE_VIEW_CONTENT,
        id,
        content,
        title,
    };
}

export const REMOVE_VIEW_CONTENT = 'REMOVE_VIEW_CONTENT';
export function removeViewContent(id) {
    return {
        type: REMOVE_VIEW_CONTENT,
        id,
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

// ----------------------------------------------------------------------------
function runBlocks(viewId, blocks, input) {
    return (dispatch) => {
        let promise = Promise.resolve(input || {});

        blocks.forEach((blockId) => {
            promise = promise.then(outputOfPreviousBlock =>
                 dispatch(runBlock({
                     id: blockId,
                     input: outputOfPreviousBlock,
                 }))
            );
        });

        promise.then((content) => {
            dispatch(receiveViewContent(viewId, content, content.title));
        })
        .catch(console.log.bind(console));
    };
}

export function runView(view) {
    return (dispatch) => {
        dispatch(requestRunningView(view.id));
        dispatch(runBlocks(view.id, view.blocks, view.input));
    };
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

export function createView(blocks, name, slug) {
    return (dispatch) => {
        dispatch(requestCreateView());

        const view = {
            blocks,
            name,
            slug,
        };

        dbViews.create(view)
        .then((res) => {
            dispatch(receiveViewCreated(res.data));
            dispatch(clearNewViewData());
            history.push(`/edit/view/${res.data.id}`);
            return res.data;
        })
        .catch(console.log.bind(console));
    };
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

export function saveView(id, blocks, name, slug) {
    return (dispatch) => {
        dispatch(requestSaveView(id));

        dbViews.get(id)
        .then((res) => {
            const view = Object.assign({}, res.data, {
                blocks,
                name,
                slug,
            });

            dbViews.update(view.data)
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
    return (dispatch) => {
        dispatch(requestDeleteView(id));

        dbViews.delete(id)
        .then(() => {
            dbViews.sync()
            .then(() => dispatch(receiveViewDeleted(id)))
            .catch(console.log.bind(console));
        })
        .catch(console.log.bind(console));
    };
}

// ----------------------------------------------------------------------------
export const UPDATE_VIEW_INPUT = 'UPDATE_VIEW_INPUT';
export function updateViewInput(id, input) {
    return {
        type: UPDATE_VIEW_INPUT,
        id,
        input,
    };
}
