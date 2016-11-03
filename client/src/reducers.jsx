import { combineReducers } from 'redux';

import {
    FETCHING_BLOCK_META,
    RECEIVE_BLOCKS,
    RECEIVE_BLOCK_META,
    RECEIVE_BLOCK_DELETED,
    UPDATE_BLOCK,
    UPDATE_BLOCK_CONTROLLER,
    UPDATE_BLOCK_MODEL,
    UPDATE_BLOCK_PARAM,
} from './actions/blocks.jsx';
import {
    VISIT_EDIT_VIEW_PAGE,
    VISIT_EDIT_BLOCK_PAGE,
} from './actions/history.jsx';
import {
    CLEAR_NEW_VIEW_DATA,
    RECEIVE_CREATED_VIEW,
    RECEIVE_VIEW_CONTENT,
    REMOVE_VIEW_CONTENT,
    RECEIVE_VIEW_DELETED,
    RECEIVE_VIEW_META,
    RECEIVE_VIEWS,
    REQUEST_VIEW_META,
    REQUEST_RUNNING_VIEW,
    UPDATE_VIEW,
    UPDATE_VIEW_META,
    UPDATE_VIEW_INPUT,
} from './actions/views.jsx';


function view(state = {
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
    case RECEIVE_VIEW_CONTENT:
        return Object.assign({}, state, {
            isRunning: false,
            id: action.id,
            content: action.content,
            title: action.title,
        });
    case REMOVE_VIEW_CONTENT:
        return Object.assign({}, state, {
            content: null,
        });
    case UPDATE_VIEW:
        return Object.assign({}, state, action.view);
    case RECEIVE_VIEW_META:
    case UPDATE_VIEW_META:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            id: action.id,
            blocks: action.blocks,
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
            blocks: [],
            name: '',
            slug: '',
        });
    case UPDATE_VIEW_INPUT:
        return Object.assign({}, state, {
            input: action.input,
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
    case UPDATE_VIEW_INPUT:
        return Object.assign({}, state, {
            [action.id]: view(state[action.id], action),
        });
    case RECEIVE_VIEWS:
        newViews = {};
        action.views.forEach((elem) => {
            const subAction = Object.assign({}, elem, { type: RECEIVE_VIEW_META });
            newViews[subAction.id] = view(state[subAction.id], subAction);
        });
        return newViews;
    case RECEIVE_VIEW_DELETED:
        newViews = Object.assign({}, state);
        if (Object.hasOwnProperty.call(newViews, action.id)) {
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
    case UPDATE_BLOCK_MODEL:
        return Object.assign({}, state, {
            endpoint: action.endpoint,
            params: action.params,
        });
    default:
        return state;
    }
}

function param(state = {
    name: '',
    defaultValue: null,
    required: false,
}, action) {
    switch (action.type) {
    case UPDATE_BLOCK_PARAM:
        return Object.assign({}, state, {
            name: action.param.name,
            defaultValue: action.param.defaultValue,
            required: action.param.required,
        });
    default:
        return state;
    }
}

function block(state = {
    isFetching: false,
    didInvalidate: false,
    id: null,
    params: [],
    models: [],
    controller: '',
    name: '',
    slug: '',
    title: '',
    content: '',
}, action) {
    switch (action.type) {
    case FETCHING_BLOCK_META:
        return Object.assign({}, state, {
            isFetching: true,
        });
    case RECEIVE_BLOCK_META:
        return Object.assign({}, state, {
            isFetching: false,
            id: action.id,
            params: action.block.params,
            models: action.block.models,
            controller: action.block.controller,
            name: action.block.name,
            slug: action.block.slug,
        });
    case UPDATE_BLOCK:
        return Object.assign({}, state, action.block);
    case UPDATE_BLOCK_CONTROLLER:
        return Object.assign({}, state, {
            id: action.id,
            controller: action.controller,
        });
    case UPDATE_BLOCK_MODEL:
        return Object.assign({}, state, {
            models: state.models.map((item, index) => {
                if (index === action.modelIndex) {
                    return model(item, action);
                }
                return item;
            }),
        });
    case UPDATE_BLOCK_PARAM:
        return Object.assign({}, state, {
            params: state.params.map((item, index) => {
                if (index === action.paramIndex) {
                    return param(item, action);
                }
                return item;
            }),
        });
    default:
        return state;
    }
}

function blocks(state = {}, action) {
    let newBlocks;

    switch (action.type) {
    case FETCHING_BLOCK_META:
    case RECEIVE_BLOCK_META:
    case UPDATE_BLOCK:
    case UPDATE_BLOCK_CONTROLLER:
    case UPDATE_BLOCK_MODEL:
    case UPDATE_BLOCK_PARAM:
        return Object.assign({}, state, {
            [action.id]: block(state[action.id], action),
        });
    case RECEIVE_BLOCKS:
        newBlocks = {};
        action.blocks.forEach((elem) => {
            const newAction = {
                type: RECEIVE_BLOCK_META,
                id: elem.id,
                block: elem,
            };
            newBlocks[elem.id] = block(state[elem.id], newAction);
        });
        return newBlocks;
    case RECEIVE_BLOCK_DELETED:
        newBlocks = Object.assign({}, state);
        if (Object.hasOwnProperty.call(newBlocks, action.id)) {
            delete newBlocks[action.id];
        }
        return newBlocks;
    default:
        return state;
    }
}

function history(state = {
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
