import {
    FETCHING_BLOCK_META,
    RECEIVE_BLOCKS,
    RECEIVE_BLOCK_META,
    RECEIVE_BLOCK_DELETED,
    UPDATE_BLOCK,
    UPDATE_BLOCK_CONTROLLER,
    UPDATE_BLOCK_MODEL,
    UPDATE_BLOCK_PARAM,
} from '../actions/blocks.jsx';


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

export default function blocks(state = {}, action) {
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
